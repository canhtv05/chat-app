import { Fragment, useCallback, useRef, useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import { IoIosSend } from 'react-icons/io';
import { AiFillLike } from 'react-icons/ai';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';
import { FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import MyButton from '~/components/MyButton';
import MyTextArea from '~/components/MyTextArea';
import RenderIf from '~/components/RenderIf';
import useTextAreaResize from '~/hooks/useTextAreaResize';
import { sendImage, sendMessage } from '~/services/message/messageService';
import socketService from '~/services/socket/socketService';
import { setSending } from '~/redux/reducers/chatSlice';

const styles = {
    '--epr-bg-color': 'oklch(var(--b3))',
    '--epr-category-label-bg-color': 'oklch(var(--b3))',
    '--epr-search-input-bg-color': 'oklch(var(--b2))',
    '--epr-picker-border-color': 'transparent',
};

function ChatBoxFooter({ content, setContent, onSend, currentIdChat, setShouldScrollToBottom }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const data = useSelector((state) => state.chat.data);
    const user = data?.createdBy?.id ? data?.users.find((user) => user.id !== currentUserId) : data;
    const [isLineBeak, setIsLineBeak] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [tempFiles, setTempFiles] = useState([]);
    const [tempUrls, setTempUrls] = useState([]);
    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleChange = useTextAreaResize({ setContent, setIsLineBeak });

    const handleOnEmojiClick = useCallback(
        (emojiData, event) => {
            const textarea = textAreaRef.current;
            if (!textarea) return;

            const { selectionStart, selectionEnd, value } = textarea;
            const emoji = emojiData?.emoji;

            const newContent = value.slice(0, selectionStart) + emoji + value.slice(selectionEnd);

            setContent(newContent);

            const timeout = setTimeout(() => {
                // update cursor position
                const pos = selectionStart + emoji.length;
                textarea.setSelectionRange(pos, pos);
            }, 0);

            return () => {
                clearTimeout(timeout);
            };
        },
        [setContent],
    );

    const handleImageSelect = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

            const newFiles = [];
            const newUrls = [];

            for (const file of files) {
                if (!validTypes.includes(file.type)) {
                    toast.error(t('common.toast.imageOnly'));
                    continue;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(t('common.toast.sizeExceeded'));
                    continue;
                }

                newFiles.push(file);
                const tempUrl = URL.createObjectURL(file);
                newUrls.push(tempUrl);
            }

            setTempFiles((prev) => [...prev, ...newFiles]);
            setTempUrls((prev) => [...prev, ...newUrls]);
            e.target.value = null;
        },
        [t],
    );

    const handleClick = useCallback(async () => {
        dispatch(setSending(true));
        if (content.length === 0 && tempFiles.length === 0) {
            onSend('like');
            dispatch(setSending(false));
            return;
        }

        const filesToSend = [...tempFiles];
        const urlsToSend = [...tempUrls];

        setTempFiles([]);
        setTempUrls([]);
        setContent('');
        setIsLineBeak(false);
        textAreaRef.current.style.height = '36px';
        setShouldScrollToBottom(true);

        if (content.length > 0) {
            onSend(content, null);
        }

        if (filesToSend.length > 0) {
            for (let i = 0; i < filesToSend.length; i++) {
                const tempFile = filesToSend[i];
                const tempUrl = urlsToSend[i];

                const formData = new FormData();
                formData.append('file', tempFile);

                onSend('', tempUrl);

                const timestamp = new Date().toISOString();

                const [err, result] = await sendImage(formData);
                if (err) {
                    toast.error(t('common.toast.uploadFailed'));
                    onSend('', '', currentIdChat.current);
                    continue;
                }

                await sendMessage({
                    chatId: currentIdChat.current,
                    content: '',
                    imageUrl: result.data,
                });

                if (socketService.isReady()) {
                    socketService.send('message', {
                        chatId: currentIdChat.current,
                        content: '',
                        userId: currentUserId,
                        timestamp,
                        imageUrl: result.data,
                    });
                }
            }
        }
        dispatch(setSending(false));
        tempUrls.forEach((url) => URL.revokeObjectURL(url));
    }, [
        content,
        tempFiles,
        tempUrls,
        setContent,
        setShouldScrollToBottom,
        onSend,
        currentUserId,
        currentIdChat,
        dispatch,
        t,
    ]);

    const handleRemoveTmpImg = (index) => {
        setTempUrls((prev) => {
            return prev.filter((imgTmp, i) => {
                if (i === index) URL.revokeObjectURL(imgTmp);
                return i !== index;
            });
        });
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                handleClick();
                setContent('');
                setIsLineBeak(false);
                textAreaRef.current.style.height = '36px';
                e.preventDefault();
            }
        },
        [handleClick, setContent],
    );

    return (
        <>
            <div className={`relative w-full`}>
                <div
                    className={`flex ${
                        isLineBeak ? 'flex-col p-5' : 'flex-row p-5'
                    }  justify-between items-center relative w-full`}
                >
                    <div className={`${isLineBeak ? 'absolute left-3 bottom-3' : ''}`}>
                        <MyButton size="sm" onClick={() => fileInputRef.current.click()}>
                            <CiImageOn className="size-7 text-base-content cursor-pointer" />
                        </MyButton>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/jpeg,image/png,image/gif"
                        style={{ display: 'none' }}
                        multiple
                    />
                    <MyTextArea
                        ref={textAreaRef}
                        placeholder={`${t('chatBox.sendTo')} ${user?.firstName ?? ''} ${user?.lastName ?? ''}...`}
                        type="text"
                        value={content}
                        onChange={handleChange}
                        width={isLineBeak ? '100%' : '90%'}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={`items-center flex ${isLineBeak ? 'mt-2 justify-end w-full' : 'justify-center'}`}>
                        <MyButton size="sm" onClick={() => setOpenEmoji((prev) => !prev)}>
                            <CiFaceSmile className="size-7 text-base-content cursor-pointer" />
                        </MyButton>
                        <MyButton size="sm" onClick={handleClick}>
                            <RenderIf value={content.length !== 0 || tempUrls.length > 0}>
                                <IoIosSend className="size-7 text-primary cursor-pointer rotate-45" />
                            </RenderIf>
                            <RenderIf value={content.length === 0 && tempUrls.length === 0}>
                                <AiFillLike className="size-7 text-primary cursor-pointer" />
                            </RenderIf>
                        </MyButton>
                    </div>
                    <div className="absolute top-[-440px] right-[310px]">
                        <RenderIf value={openEmoji}>
                            <div className="absolute">
                                <EmojiPicker
                                    width={300}
                                    previewConfig={{
                                        showPreview: false,
                                    }}
                                    emojiStyle="facebook"
                                    open={openEmoji}
                                    onEmojiClick={handleOnEmojiClick}
                                    style={styles}
                                />
                            </div>
                        </RenderIf>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {tempUrls.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-row overflow-x-auto border-t w-full border-base-300 pt-2"
                    >
                        {tempUrls.map((temp, index) => (
                            <motion.div
                                key={temp}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative m-2"
                            >
                                <img
                                    src={temp}
                                    alt={`temp-${index}`}
                                    className="object-contain max-w-[150px] max-h-[150px] rounded-lg block relative"
                                    loading="lazy"
                                />
                                <button className="absolute top-1 -right-2" onClick={() => handleRemoveTmpImg(index)}>
                                    <FaTimes className="size-5 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatBoxFooter;
