import { CiSearch } from 'react-icons/ci';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useState } from 'react';

import MyInput from '~/components/MyInput/MyInput';
import AccountItem from '~/components/AccountItem/AccountItem';

const list = new Array(10).fill(0);

function Article() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="w-full h-full border-border border-r bg-background flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-border relative shrink-0">
                <MyInput
                    startDecorator={<CiSearch className="size-5" />}
                    placeholder="Search..."
                    variant="soft"
                    size="md"
                />
                <AiOutlineUserAdd className="size-6 text-text-bold cursor-pointer" />
                <AiOutlineUsergroupAdd className="size-6 text-text-bold cursor-pointer" />
            </div>
            <div className="overflow-y-auto flex-1">
                <div className="pb-6">
                    {list.map((_, index) => (
                        <AccountItem
                            key={index}
                            separator={index !== list.length - 1}
                            isActive={index === activeIndex}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Article;
