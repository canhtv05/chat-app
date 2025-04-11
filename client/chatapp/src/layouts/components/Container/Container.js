import Header from '../Header/Header';
import ChatList from '~/components/ChatList';
import ChatBox from '~/components/ChatBox';

function Container() {
    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header />
                <div className="flex w-full h-full relative">
                    <div className={`left absolute top-0 left-0 h-full w-[336px]`}>
                        <ChatList />
                    </div>
                    <div className="right absolute top-0 right-0 h-full" style={{ width: 'calc(100% - 336px)' }}>
                        <ChatBox />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Container;
