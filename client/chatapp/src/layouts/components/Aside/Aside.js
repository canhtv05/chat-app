import { ChatCardProvider } from '~/contexts/ChatCardProvider/ChatCardProvider';
import Header from '../Header/Header';
import Article from './Article/Article';
import Main from './Main/Main';

function Aside() {
    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header username={'Còn cái nịt'} />
                <ChatCardProvider>
                    <div className="flex w-full h-full relative">
                        <div className="left w-[25%] absolute top-0 left-0 h-full">
                            <Article />
                        </div>
                        <div className="right w-[75%] absolute top-0 right-0 h-full">
                            <Main />
                        </div>
                    </div>
                </ChatCardProvider>
            </div>
        </div>
    );
}

export default Aside;
