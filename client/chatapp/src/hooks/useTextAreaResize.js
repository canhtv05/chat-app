import { useCallback, useRef, useState } from 'react';

function useTextAreaResize({ setContent, setIsLineBeak }) {
    const [lengthText, setLengthText] = useState(null);

    const myRef = useRef();
    const myRef2 = useRef();

    const getTextWidth = (text, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        return context.measureText(text).width;
    };

    const handleChange = useCallback(
        (e) => {
            const value = e.target.value;
            const length = value.length;
            let maxLength = lengthText || 0;
            setContent(value);

            const textAreaElement = e.target;
            if (!textAreaElement) return;

            textAreaElement.style.height = `36px`;

            const textAreaWidth = textAreaElement.offsetWidth;
            const textWidth = getTextWidth(value, getComputedStyle(textAreaElement).font);

            if (textWidth >= textAreaWidth - 20) {
                setIsLineBeak(true);
                if (!myRef2.current) {
                    myRef2.current = length;
                }
                maxLength = Math.min(myRef2.current ?? 0, length);
                if (maxLength) setLengthText(maxLength);

                if (!myRef.current) {
                    myRef.current = textWidth;
                }
            }

            console.log(textWidth, textAreaWidth - 40);

            if (textWidth > textAreaWidth - 20 && length > maxLength) {
                const scrollHeight = e.target.scrollHeight;
                textAreaElement.style.height = `${scrollHeight + 4}px`;
            }

            if (length < maxLength) {
                setIsLineBeak(false);
                myRef2.current = null;
            }

            if (length === 0 || value === '') {
                setIsLineBeak(false);
                myRef2.current = null;
                myRef.current = null;
                setLengthText(null);
            }
        },
        [lengthText, setContent, setIsLineBeak],
    );

    return handleChange;
}

export default useTextAreaResize;
