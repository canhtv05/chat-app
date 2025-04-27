import { useCallback, useRef, useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import { IoIosSend } from 'react-icons/io';
import { AiFillLike } from 'react-icons/ai';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';

import MyButton from '~/components/MyButton';
import MyTextArea from '~/components/MyTextArea';
import RenderIf from '~/components/RenderIf';
import useTextAreaResize from '~/hooks/useTextAreaResize';
import { sendImage, sendMessage } from '~/services/message/messageService';
import socketService from '~/services/socket/socketService';

const styles = {
    '--epr-bg-color': 'oklch(var(--b3))',
    '--epr-category-label-bg-color': 'oklch(var(--b3))',
    '--epr-search-input-bg-color': 'oklch(var(--b2))',
    '--epr-picker-border-color': 'transparent',
};

function ChatBoxFooter({ content, setContent, onSend, setIsSending, currentIdChat, setShouldScrollToBottom }) {
    const { t } = useTranslation();
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const data = useSelector((state) => state.chat.data);
    const user = data?.createdBy?.id ? data?.users.find((user) => user.id !== currentUserId) : data;
    const [isLineBeak, setIsLineBeak] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleChange = useTextAreaResize({ setContent, setIsLineBeak });

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                onSend();
                setContent('');
                setIsLineBeak(false);
                textAreaRef.current.style.height = '36px';
                e.preventDefault();
            }
        },
        [setContent, onSend],
    );

    const handleClick = useCallback(
        (typeIcon) => {
            if (typeIcon) onSend(typeIcon);
            else onSend();
            setIsLineBeak(false);
            textAreaRef.current.style.height = '36px';
            setContent('');
        },
        [onSend, setContent],
    );

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

    const handleImageUpload = useCallback(
        async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                toast.error(t('common.toast.imageOnly'));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('common.toast.sizeExceeded'));
                return;
            }

            const tempUrl = URL.createObjectURL(file);
            setTempUrl(tempUrl);
            setIsSending(true);
            onSend(content, tempUrl);

            const formData = new FormData();
            formData.append('file', file);

            const [err, result] = await sendImage(formData);
            if (err) {
                toast.error(t('common.toast.uploadFailed'));
                e.target.value = null;
                return;
            }
            await sendMessage({ chatId: currentIdChat.current, content: content, imageUrl: result.data });
            setIsSending(false);
            setContent('');
            URL.revokeObjectURL(tempUrl);

            const timestamp = new Date().toISOString();
            if (socketService.isReady()) {
                socketService.send('message', {
                    chatId: currentIdChat.current,
                    content: content,
                    userId: currentUserId,
                    timestamp,
                    imageUrl: result.data,
                });
            }
            setShouldScrollToBottom(true);
            e.target.value = null;
        },
        [content, currentIdChat, currentUserId, onSend, setContent, setIsSending, setShouldScrollToBottom, t],
    );

    return (
        <div
            className={`p-5 relative flex ${
                isLineBeak ? 'flex-col pb-3' : 'flex-row'
            } justify-between items-center border-b border-base-300 relative w-full`}
        >
            <MyButton size="sm" onClick={() => fileInputRef.current.click()}>
                <CiImageOn className="size-7 text-base-content cursor-pointer" />
            </MyButton>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
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
                <MyButton size="sm" onClick={content.length === 0 ? () => handleClick('like') : () => handleClick()}>
                    <RenderIf value={content.length !== 0}>
                        <IoIosSend className="size-7 text-primary cursor-pointer rotate-45" />
                    </RenderIf>
                    <RenderIf value={content.length === 0}>
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
    );
}

export default ChatBoxFooter;
