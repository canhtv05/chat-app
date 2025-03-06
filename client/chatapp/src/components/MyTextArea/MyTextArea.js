import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';

const MyTextArea = forwardRef(({ width = '100%', ...props }, ref) => {
    return (
        <textarea
            {...props}
            ref={ref}
            style={{
                width,
                height: 36,
            }}
            className={`bg-background-secondary text-text-bold resize-none p-[4px] max-h-[84px] px-2 rounded border-2 border-transparent focus:border-[#1976d2] focus:outline-none`}
        />
    );
});

MyTextArea.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(MyTextArea);
