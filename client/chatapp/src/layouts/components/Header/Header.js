import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function Header() {
    const { firstName, lastName } = useSelector((state) => state.auth.data.data);

    return (
        <div className="w-full p-1 bg-base-100 pl-1 border-b border-base-300 shrink-0 h-[30px]">
            <span className="text-base-content text-sm ml-5 font-semibold truncate max-w-[90%] block">
                {`Hello, ${firstName} ${lastName}!`}
            </span>
        </div>
    );
}

Header.propTypes = {
    username: PropTypes.string,
};

export default Header;
