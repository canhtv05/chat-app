import { useCallback, useRef, useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import { IoIosSend } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';

import MyButton from '~/components/MyButton';
import MyTextArea from '~/components/MyTextArea';
import RenderIf from '~/components/RenderIf';
import useTextAreaResize from '~/hooks/useTextAreaResize';
import useLocalStorage from '~/hooks/useLocalStorage';

function ChatBoxFooter({ content, setContent, onSend }) {
    const [isLineBeak, setIsLineBeak] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const { dataStorage } = useLocalStorage();
    const textAreaRef = useRef(null);

    const handleChange = useTextAreaResize({ setContent, setIsLineBeak });

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                setContent('');
                onSend();
                setIsLineBeak(false);
                textAreaRef.current.style.height = '36px';
                e.preventDefault();
            }
        },
        [setContent, onSend],
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
                textarea.focus();
                textarea.setSelectionRange(pos, pos);
            }, 0);

            return () => {
                clearTimeout(timeout);
            };
        },
        [setContent],
    );

    return (
        <div
            className={`p-5 relative flex ${
                isLineBeak ? 'flex-col pb-3' : 'flex-row'
            } justify-between items-center border-b border-base-300 relative w-full`}
        >
            <MyTextArea
                ref={textAreaRef}
                placeholder="Send to VanCanh..."
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
                <MyButton size="sm" onClick={() => onSend()}>
                    <IoIosSend className="size-7 text-base-content cursor-pointer rotate-45" />
                </MyButton>
            </div>
            <div className="absolute top-[-440px] right-[310px]">
                <RenderIf value={openEmoji}>
                    <div className="absolute">
                        <EmojiPicker
                            width={300}
                            theme={dataStorage?.theme === 'dark' ? 'dark' : 'light'}
                            previewConfig={{
                                showPreview: false,
                            }}
                            emojiStyle="facebook"
                            open={openEmoji}
                            onEmojiClick={handleOnEmojiClick}
                        />
                    </div>
                </RenderIf>
            </div>
        </div>
    );
}

export default ChatBoxFooter;
