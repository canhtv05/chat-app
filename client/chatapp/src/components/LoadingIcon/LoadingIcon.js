import { AiOutlineLoading } from 'react-icons/ai';

const LoadingIcon = ({ ...props }) => {
    return <AiOutlineLoading {...props} className="animate-spin text-lg text-base-content cursor-wait" />;
};

export default LoadingIcon;
