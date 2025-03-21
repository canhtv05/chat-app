import Header from '../Header/Header';
import ChatList from '~/components/ChatList';
import ChatBox from '~/components/ChatBox';
import { ChatCardProvider } from '~/contexts/ChatCardProvider';

function Container() {
    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header />
                <ChatCardProvider>
                    <div className="flex w-full h-full relative">
                        <div className="left w-[25%] absolute top-0 left-0 h-full">
                            <ChatList />
                        </div>
                        <div className="right w-[75%] absolute top-0 right-0 h-full">
                            <ChatBox />
                        </div>
                    </div>
                </ChatCardProvider>
            </div>
        </div>
    );
}

export default Container;
