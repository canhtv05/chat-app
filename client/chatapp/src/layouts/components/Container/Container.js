import Header from '../Header/Header';
import ChatList from '~/components/ChatList';
import ChatBox from '~/components/ChatBox';
import { ChatCardProvider } from '~/contexts/ChatCardProvider';
import useWindowSize from '~/hooks/useWindowSize';

function Container({ showChatList }) {
    const { width } = useWindowSize();

    const shouldHideChatList = width < 1024 && !showChatList;

    console.log('shouldHideChatList:', shouldHideChatList, 'showChatList:', showChatList, 'width:', width);

    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header />
                <ChatCardProvider>
                    <div className="flex w-full h-full relative">
                        <div
                            className={`left absolute top-0 left-0 h-full ${
                                shouldHideChatList ? 'hidden' : 'w-[336px]'
                            }`}
                        >
                            <ChatList />
                        </div>
                        <div
                            className="right absolute top-0 right-0 h-full"
                            style={{ width: shouldHideChatList ? '100%' : 'calc(100% - 336px)' }}
                        >
                            <ChatBox />
                        </div>
                    </div>
                </ChatCardProvider>
            </div>
        </div>
    );
}

export default Container;
