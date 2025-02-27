import { createContext, useState } from 'react';

const ChatCardContext = createContext();

function ChatCardProvider({ children }) {
    const [currentChat, setCurrentChat] = useState(false);

    return <ChatCardContext.Provider value={{ currentChat, setCurrentChat }}>{children}</ChatCardContext.Provider>;
}

export { ChatCardProvider, ChatCardContext };
