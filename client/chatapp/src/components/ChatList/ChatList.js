import { CiSearch } from 'react-icons/ci';
import { AiOutlineLoading, AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ChatCardContext } from '~/contexts/ChatCardProvider';
import MyInput from '../MyInput';
import MyButton from '../MyButton';
import AccountItem from '../AccountItem';
import ModalAddGroup from './ModalAddGroup';
import useDebounce from '~/hooks/useDebounce';
import { searchUser } from '~/services/user/userService';
import RenderIf from '../RenderIf';
import { useDispatch, useSelector } from 'react-redux';
import { setIdChatOfUser, setInfoCurrentChat } from '~/redux/reducers/chatSlice';
import { getAllMyChats } from '~/services/chat/chatService';
import { getAllMessagesFromChat } from '~/services/message/messageService';
import colors from '../AccountItem/colors';

function ChatList() {
    const dispatch = useDispatch();
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [isShowModalAddGroup, setIsShowModalAddGroup] = useState(false);
    const [searchRes, setSearchRes] = useState([]);
    const [chats, setChats] = useState([]);
    const [lastMessages, setLastMessages] = useState({});

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastAccountItemRef = useRef();

    const debounceValue = useDebounce(query, 500);
    const { setCurrentChat } = useContext(ChatCardContext);

    const getRandomBackground = () => {
        const randomIndex = Math.floor(Math.random() * colors.backgrounds.length);
        return colors.backgrounds[randomIndex];
    };

    useEffect(() => {
        setPage(1);
        setSearchRes([]);
        setHasMore(true);
        setError(null);
        setActiveIndex(null);
        setError(null);
    }, [debounceValue]);

    useEffect(() => {
        const fetchApi = async () => {
            const [error, result] = await getAllMyChats();
            if (error) {
                setError('Failed to load chats. Please try again.');
                return;
            }

            const chatsData = result.data || [];
            const chatUserMapping = {};
            const chatsWithBackground = chatsData.map((chat) => {
                if (!chat?.isGroup) {
                    const otherUser = chat?.users?.find((user) => user?.id !== currentUserId);
                    if (otherUser) {
                        // user id: chat id
                        chatUserMapping[otherUser?.id] = chat?.id;
                    }
                }

                return {
                    ...chat,
                    background: getRandomBackground(),
                };
            });

            setChats(chatsWithBackground);
            dispatch(setIdChatOfUser(chatUserMapping));

            // get last message
            const initialLastMessages = {};
            for (let i = 0; i < chatsData.length; i++) {
                const [error, result] = await getAllMessagesFromChat(chatsData[i].id);
                if (!error && result.data && result.data.length > 0) {
                    initialLastMessages[chatsData[i].id] = result.data[result.data.length - 1];
                }
            }
            setLastMessages(initialLastMessages);
        };

        fetchApi();
    }, [dispatch, currentUserId]);

    useEffect(() => {
        if (!debounceValue.trim()) {
            setSearchRes([]);
            setLoading(false);
            setHasMore(false);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            setError(null);

            const [error, result] = await searchUser(debounceValue, page);
            if (error) {
                setError('Failed to load search results. Please try again.');
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
                    background: getRandomBackground(),
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
            setCurrentChat(true);
            // kiểm tra xem nếu có created by thì là list chat, còn ko thì là search user
            if (!!data?.createdBy)
                dispatch(setInfoCurrentChat({ ...data, idUser: data?.createdBy?.id, background: data.background }));
            else
                dispatch(
                    setInfoCurrentChat({ ...data, isSearch: true, idUser: data?.id, background: data.background }),
                );
        },
        [setCurrentChat, dispatch],
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        if (value.trim()) {
            setQuery(value);
        } else {
            setQuery('');
        }
    };

    const LoadingIcon = ({ ...props }) => {
        return (
            <div {...props}>
                <AiOutlineLoading className="animate-spin text-lg text-text-bold" />
            </div>
        );
    };

    return (
        <div className="w-full h-full border-border border-r bg-background flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-border relative shrink-0">
                <div className="relative">
                    <MyInput
                        startDecorator={<CiSearch className="size-5" />}
                        placeholder="Search..."
                        variant="soft"
                        size="md"
                        onChange={handleSearch}
                        value={query}
                    />
                    <RenderIf value={loading}>
                        <LoadingIcon className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 " />
                    </RenderIf>
                </div>
                <MyButton size="sm">
                    <AiOutlineUserAdd className="size-6 text-text-bold cursor-pointer" />
                </MyButton>
                <MyButton size="sm" onClick={() => setIsShowModalAddGroup(true)}>
                    <AiOutlineUsergroupAdd className="size-6 text-text-bold cursor-pointer" />
                </MyButton>
            </div>
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

                <RenderIf value={!debounceValue && !loading}>
                    {chats.map((chat, index) => (
                        <AccountItem
                            key={chat.id}
                            separator={index !== chats.length - 1}
                            isActive={index === activeIndex}
                            onClick={() => handleClick(index, chat)}
                            data={{ ...chat, lastMessage: lastMessages[chat.id] }}
                        />
                    ))}
                </RenderIf>

                <RenderIf value={!loading && debounceValue && searchRes.length === 0}>
                    <div className="p-5 text-center text-text-bold">No users found!</div>
                </RenderIf>

                <RenderIf value={error}>
                    <div className="p-5 text-center text-red-500">{error}</div>
                </RenderIf>
            </div>
            <ModalAddGroup isOpen={isShowModalAddGroup} setIsOpen={setIsShowModalAddGroup} />
        </div>
    );
}

export default ChatList;
