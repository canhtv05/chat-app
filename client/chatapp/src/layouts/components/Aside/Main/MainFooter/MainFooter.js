import { useRef, useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import { FiSend } from 'react-icons/fi';

import MyButton from '~/components/MyButton/MyButton';
import MyTextArea from '~/components/MyTextArea/MyTextArea';
import useTextAreaResize from '~/hooks/useTextAreaResize';

function MainFooter() {
    const [isLineBeak, setIsLineBeak] = useState(false);
    const [content, setContent] = useState('');
    const textAreaRef = useRef(null);

    const handleChange = useTextAreaResize({ setContent, setIsLineBeak });

    return (
        <div className="p-5 flex justify-between items-center border-b border-border relative w-full">
            <MyTextArea
                ref={textAreaRef}
                placeholder="Send to VanCanh..."
                type="text"
                value={content}
                onChange={handleChange}
                width={isLineBeak ? '100%' : '90%'}
            />
            <div className="items-center justify-center hidden">
                <MyButton minHeight={40} minWidth={40}>
                    <CiFaceSmile className="size-7 text-text-bold cursor-pointer" />
                </MyButton>
                <MyButton minHeight={40} minWidth={40}>
                    <FiSend className="size-7 text-text-bold cursor-pointer" />
                </MyButton>
            </div>
        </div>
    );
}

export default MainFooter;
