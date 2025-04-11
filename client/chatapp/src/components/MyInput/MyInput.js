import { Input } from '@mui/joy';

function MyInput({ className, ...props }) {
    return (
        <div className={className}>
            <Input
                {...props}
                sx={{
                    background: 'var(--color-base-200)',
                    color: 'var(--color-base-content)',
                    minWidth: 0,
                    width: 'auto',
                }}
            />
        </div>
    );
}

export default MyInput;
