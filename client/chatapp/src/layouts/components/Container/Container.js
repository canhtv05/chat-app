import Header from '../Header/Header';
import ChatList from '~/components/ChatList';
import ChatBox from '~/components/ChatBox';
import { ChatCardProvider } from '~/contexts/ChatCardProvider';
import useWindowSize from '~/hooks/useWindowSize';

function Container() {
    const { width } = useWindowSize();

    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header />
                <ChatCardProvider>
                    <div className="flex w-full h-full relative">
                        <div className={`left absolute top-0 left-0 h-full ${width < 1024 ? 'hidden' : 'w-[400px]'}`}>
                            <ChatList />
                        </div>
                        <div
                            className="right absolute top-0 right-0 h-full"
                            style={{ width: width < 1024 ? '100%' : 'calc(100% - 400px)' }}
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
