import { Radio } from '@mui/joy';

function MyRadio({ styles, ...props }) {
    return <Radio {...props} sx={{ background: 'var(--color-base-200)', color: 'var(--color-base-content)' }} />;
}

export default MyRadio;
