import { useState } from 'react';

import useWindowSize from '~/hooks/useWindowSize';
import Container from '~/layouts/components/Container';
import MenuSidebar from '~/layouts/components/MenuSidebar';

function Chat() {
    const { width } = useWindowSize();
    const [showChatList, setShowChatList] = useState(width >= 1024);

    console.log('showChatList in Chat:', showChatList);

    return (
        <>
            <div className="left w-[78px]">
                <MenuSidebar setShowChatList={setShowChatList} />
            </div>
            <div className="right w-full">
                <Container showChatList={showChatList} />
            </div>
        </>
    );
}

export default Chat;
