import { useRef, useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import { IoIosSend } from 'react-icons/io';

import MyButton from '~/components/MyButton';
import MyTextArea from '~/components/MyTextArea';

import useTextAreaResize from '~/hooks/useTextAreaResize';

function ChatBoxFooter() {
    const [isLineBeak, setIsLineBeak] = useState(false);
    const [content, setContent] = useState('');
    const textAreaRef = useRef(null);

    const handleChange = useTextAreaResize({ setContent, setIsLineBeak });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setContent('');
            setIsLineBeak(false);
            textAreaRef.current.style.height = '36px';
            e.preventDefault();
        }
    };

    return (
        <div
            className={`p-5 flex ${
                isLineBeak ? 'flex-col pb-3' : 'flex-row'
            } justify-between items-center border-b border-border relative w-full`}
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
                <MyButton size="sm">
                    <CiFaceSmile className="size-7 text-text-bold cursor-pointer" />
                </MyButton>
                <MyButton size="sm">
                    <IoIosSend className="size-7 text-text-bold cursor-pointer rotate-45" />
                </MyButton>
            </div>
        </div>
    );
}

export default ChatBoxFooter;
