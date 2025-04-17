import { Input } from '@mui/joy';

function MyInput({ className, ...props }) {
    return (
        <div className={className}>
            <Input
                {...props}
                sx={{
                    background: 'oklch(var(--b2))',
                    color: 'oklch(var(--bc))',
                    minWidth: 0,
                    width: 'auto',
                }}
            />
        </div>
    );
}

export default MyInput;
