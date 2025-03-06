import { Avatar } from '@mui/joy';
import PropTypes from 'prop-types';
import { memo, useEffect, useRef } from 'react';

function AccountItem({ separator, isMe, isOnline, isActive, onClick }) {
    const divRef = useRef();

    useEffect(() => {
        if (isActive) {
            divRef.current.classList.add('bg-background-secondary');
        } else {
            divRef.current.classList.remove('bg-background-secondary');
        }
    }, [isActive]);

    return (
        <div className={`cursor-pointer ${isActive ? '' : 'hover:bg-active'}`} ref={divRef} onClick={onClick}>
            <div className={separator ? 'border-border border-b p-6' : 'p-6'}>
                <div className="flex">
                    <div className="relative">
                        <Avatar
                            alt="Remy Sharp"
                            src="https://avatars.githubusercontent.com/u/166397227?u=b890f6ef06b108063dca01ecbd15bcf2e0cf46a1&v=4"
                            sx={{ width: 50, height: 50 }}
                        />
                        {isOnline && (
                            <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute right-1 top-10"></span>
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="ml-4 flex justify-between">
                            <span className="text-text-bold font-semibold max-w-[150px] truncate inline-block">
                                Tran Van Canh
                            </span>
                            <span className="text-text-bold font-thin">4 hours ago</span>
                        </div>
                        <div className="ml-4 mt-1 flex">
                            <span className="text-text-light max-w-[100px] truncate inline-block">
                                {isMe ? 'You' : 'Tran Van Canh'}
                            </span>
                            <span className="inline-block text-text-light">:</span>
                            <span className="ml-2 text-text-light max-w-[145px] truncate inline-block">
                                hello worlddddddddwww
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AccountItem.propTypes = {
    separator: PropTypes.bool,
    isMe: PropTypes.bool,
    isOnline: PropTypes.bool,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default memo(AccountItem);
