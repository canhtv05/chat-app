import { CiSearch } from 'react-icons/ci';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useContext, useState } from 'react';

import { ChatCardContext } from '~/contexts/ChatCardProvider';
import MyInput from '../MyInput';
import MyButton from '../MyButton';
import AccountItem from '../AccountItem';
import ModalAddGroup from './ModalAddGroup';

const list = new Array(10).fill(0);

function ChatList() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [query, setQuery] = useState('');
    const [isShowModalAddGroup, setIsShowModalAddGroup] = useState(true);

    const { setCurrentChat } = useContext(ChatCardContext);

    const handleClick = (index) => {
        setActiveIndex(index);
        setCurrentChat(true);
    };

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="w-full h-full border-border border-r bg-background flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-border relative shrink-0">
                <MyInput
                    startDecorator={<CiSearch className="size-5" />}
                    placeholder="Search..."
                    variant="soft"
                    size="md"
                    onChange={handleSearch}
                    value={query}
                />
                <MyButton size="sm">
                    <AiOutlineUserAdd className="size-6 text-text-bold cursor-pointer" />
                </MyButton>
                <MyButton size="sm" onClick={() => setIsShowModalAddGroup(true)}>
                    <AiOutlineUsergroupAdd className="size-6 text-text-bold cursor-pointer" />
                </MyButton>
            </div>
            <div className="overflow-y-auto" tabIndex={-1}>
                {query &&
                    list.map((_, index) => (
                        <AccountItem
                            key={index}
                            separator={index !== list.length - 1}
                            isActive={index === activeIndex}
                            onClick={() => handleClick(index)}
                        />
                    ))}
            </div>
            <ModalAddGroup isOpen={isShowModalAddGroup} setIsOpen={setIsShowModalAddGroup} />
        </div>
    );
}

export default ChatList;
