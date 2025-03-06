import { Radio } from '@mui/joy';

function MyRadio({ styles, ...props }) {
    return (
        <Radio {...props} sx={{ background: 'rgba(var(--background-secondary))', color: 'rgba(var(--text-bold))' }} />
    );
}

export default MyRadio;
