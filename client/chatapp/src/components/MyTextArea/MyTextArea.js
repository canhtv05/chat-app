import { Textarea } from '@mui/joy';
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';

const MyTextArea = forwardRef(({ width = '100%', ...props }, ref) => {
    return (
        <Textarea
            {...props}
            ref={ref}
            sx={{
                background: 'rgba(var(--background-secondary))',
                color: 'rgba(var(--text-bold))',
                width,
            }}
        />
    );
});

MyTextArea.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(MyTextArea);
