import { Input } from '@mui/joy';

function MyInput({ className, ...props }) {
    return (
        <div className={className}>
            <Input
                {...props}
                sx={{
                    background: 'rgba(var(--background-secondary))',
                    color: 'rgba(var(--text-bold))',
                    minWidth: 0,
                    width: 'auto',
                }}
            />
        </div>
    );
}

export default MyInput;
