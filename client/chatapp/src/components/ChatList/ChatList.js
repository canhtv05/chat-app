import { CiSearch } from 'react-icons/ci';
import { toast } from 'react-hot-toast';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import MyInput from '../MyInput';
import MyButton from '../MyButton';
import AccountItem from '../AccountItem';
import ModalAddGroup from './ModalAddGroup';
import useDebounce from '~/hooks/useDebounce';
import RenderIf from '../RenderIf';
import {
    addLastMessage,
    setChats,
    setCurrentChat,
    setDisableSearch,
    setIdChatOfUser,
    setInfoCurrentChat,
    setLastMessage,
} from '~/redux/reducers/chatSlice';
import { searchUser } from '~/services/user/userService';
import { getAllMyChats } from '~/services/chat/chatService';
import { getLastMessageByIdChat } from '~/services/message/messageService';
import socketService from '~/services/socket/socketService';
import LoadingIcon from '../LoadingIcon';
import { ChatListSkeleton } from '../Skeleton';

function ChatList() {
    const dispatch = useDispatch();
    const { idChat } = useParams();
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingChatList, setLoadingChatList] = useState(false);
    const [query, setQuery] = useState('');
    const [isShowModalAddGroup, setIsShowModalAddGroup] = useState(false);
    const [searchRes, setSearchRes] = useState([]);
    const { chats, isDisableSearch } = useSelector((state) => state.chat);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastAccountItemRef = useRef();

    const onChatCreated = useCallback(
        (payload) => {
            const received = JSON.parse(payload.body);
            if (!received?.users?.some((user) => user.id === currentUserId)) return;
            dispatch(setChats([received, ...chats]));
            dispatch(addLastMessage(received));
        },
        [dispatch, currentUserId, chats],
    );

    const debounceValue = useDebounce(query, 500);

    useEffect(() => {
        if (isDisableSearch) {
            setQuery('');
        }
    }, [isDisableSearch, query]);

    useEffect(() => {
        // phai nhan duoc data o day vào đây
        socketService.subscribe(`/create-single-chat`, onChatCreated);
        return () => {
            socketService.unsubscription(`/create-single-chat`);
        };
    }, [onChatCreated]);

    useEffect(() => {
        setPage(1);
        setSearchRes([]);
        setHasMore(true);
        setActiveIndex(null);
    }, [debounceValue]);

    useEffect(() => {
        const fetchApi = async () => {
            setLoadingChatList(true);
            const [error, result] = await getAllMyChats();
            if (error) {
                toast.error('Failed to load chats. Please try again.');
                return;
            }
            const chatsData = result.data || [];
            const chatUserMapping = {};
            const chats = chatsData.map((chat) => {
                if (!chat?.isGroup) {
                    const otherUser = chat?.users?.find((user) => user?.id !== currentUserId);
                    if (otherUser) {
                        // user id: chat id
                        chatUserMapping[otherUser?.id] = chat?.id;
                    }
                }

                return {
                    ...chat,
                };
            });

            dispatch(setChats(chats));
            dispatch(setIdChatOfUser(chatUserMapping));

            // get last message
            const initialLastMessages = {};
            for (let i = 0; i < chatsData.length; i++) {
                const [err, res] = await getLastMessageByIdChat(chatsData[i].id);
                if (!err && res.data) {
                    initialLastMessages[chatsData[i].id] = res.data;
                }
            }
            dispatch(setLastMessage(initialLastMessages));
            setLoadingChatList(false);
        };

        fetchApi();
    }, [dispatch, currentUserId]);

    useEffect(() => {
        const chat = chats.find((chat) => {
            return chat.id === idChat;
        });
        if (chat) {
            dispatch(setCurrentChat(true));
            dispatch(
                setInfoCurrentChat({
                    ...chat,
                    idUser: chat?.createdBy?.id,
                }),
            );
        }
    }, [chats, dispatch, idChat]);

    useEffect(() => {
        if (!debounceValue.trim()) {
            setSearchRes([]);
            setLoading(false);
            setHasMore(false);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            const [error, result] = await searchUser(debounceValue, page);
            if (error) {
                toast.error('Failed to load search results. Please try again.');
                setSearchRes([]);
                setHasMore(false);
                setLoading(false);
                return;
            }

            const totalPagesFromApi = result?.meta?.pagination?.totalPages || 0;

            setSearchRes((prev) => {
                const newData = result?.data || [];
                const newDataWithBackground = newData.map((user) => ({
                    ...user,
                }));
                const existingIds = new Set(prev.map((item) => item.id));
                const uniqueNewData = newDataWithBackground.filter((item) => !existingIds.has(item.id));
                return [...prev, ...uniqueNewData];
            });

            setHasMore(page < totalPagesFromApi);

            setLoading(false);
        };
        fetchApi();
    }, [debounceValue, page]);

    useEffect(() => {
        if (!hasMore || loading) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        });

        if (lastAccountItemRef.current) {
            observer.current.observe(lastAccountItemRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [hasMore, loading, searchRes]);

    const handleClick = useCallback(
        (index, data) => {
            setActiveIndex(index);
            dispatch(setCurrentChat(true));
            // kiểm tra xem nếu có created by thì là list chat, còn ko thì là search user
            if (!!data?.createdBy) {
                dispatch(setInfoCurrentChat({ ...data, idUser: data?.createdBy?.id, background: data.background }));
            } else
                dispatch(
                    setInfoCurrentChat({ ...data, isSearch: true, idUser: data?.id, background: data.background }),
                );
        },
        [dispatch],
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        if (value.trim()) {
            setQuery(value);
            dispatch(setDisableSearch(false));
        } else {
            setQuery('');
        }
    };

    return (
        <div className="w-full h-full border-base-300 border-r bg-base-100 flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-base-300 relative shrink-0">
                <div className="relative">
                    <MyInput
                        startDecorator={<CiSearch className="size-5" />}
                        placeholder="Search..."
                        variant="soft"
                        size="md"
                        onChange={handleSearch}
                        value={query}
                        className={`w-[90%]`}
                    />
                </div>

                <div className="flex -ml-3">
                    <MyButton size="sm">
                        <AiOutlineUserAdd className="size-6 text-base-content cursor-pointer" />
                    </MyButton>
                    <MyButton size="sm" onClick={() => setIsShowModalAddGroup(true)}>
                        <AiOutlineUsergroupAdd className="size-6 text-base-content cursor-pointer" />
                    </MyButton>
                </div>
            </div>
            <RenderIf value={loading}>
                <div className="flex w-full justify-center my-2">
                    <LoadingIcon size={30} />
                </div>
            </RenderIf>
            <div className="overflow-y-auto" tabIndex={-1}>
                <RenderIf value={debounceValue && searchRes.length > 0}>
                    {searchRes.map((data, index) => (
                        <AccountItem
                            key={data.id}
                            ref={index === searchRes.length - 1 ? lastAccountItemRef : null}
                            separator={index !== searchRes.length - 1}
                            isActive={index === activeIndex}
                            onClick={() => handleClick(index, data)}
                            data={data}
                            isSearchAccount={true}
                        />
                    ))}
                </RenderIf>
                <RenderIf value={!debounceValue}>
                    <RenderIf value={!loadingChatList}>
                        {chats.map((chat, index) => (
                            <AccountItem
                                key={chat.id}
                                separator={index !== chats.length - 1}
                                isActive={index === activeIndex}
                                onClick={() => handleClick(index, chat)}
                                data={chat}
                            />
                        ))}
                    </RenderIf>
                    <RenderIf value={loadingChatList}>
                        {Array(5)
                            .fill()
                            .map((_, index) => (
                                <ChatListSkeleton key={index} />
                            ))}
                    </RenderIf>
                </RenderIf>
                <RenderIf value={!loading && debounceValue && searchRes.length === 0}>
                    <div className="p-5 text-center text-base-content">No users found!</div>
                </RenderIf>
            </div>
            <ModalAddGroup isOpen={isShowModalAddGroup} setIsOpen={setIsShowModalAddGroup} />
        </div>
    );
}

export default ChatList;
