import PropTypes from 'prop-types';

function Header({ username }) {
    return (
        <div className="w-full p-1 bg-background pl-1 border-b border-border shrink-0 h-[30px]">
            <span className="text-text-bold text-sm ml-5 font-semibold truncate max-w-[90%] block">
                Hello, {username}!
            </span>
        </div>
    );
}

Header.propTypes = {
    username: PropTypes.string,
};

export default Header;
