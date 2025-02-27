import { Input } from '@mui/joy';

function MyInput({ ...props }) {
    return (
        <Input {...props} sx={{ background: 'rgba(var(--background-secondary))', color: 'rgba(var(--text-bold))' }} />
    );
}

export default MyInput;
