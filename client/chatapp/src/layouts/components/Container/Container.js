import { useTranslation } from 'react-i18next';
import { Outlet, useMatch } from 'react-router-dom';
import Header from '../Header/Header';
import ChatList from '~/components/ChatList';
import RenderIf from '~/components/RenderIf';
import icons from '~/assets/icons';

function Container() {
    const { t } = useTranslation();
    const matchRootChat = useMatch('/chats');
    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex flex-col w-full h-full overflow-hidden">
                <Header />
                <div className="flex w-full h-full relative">
                    <div className={`left absolute top-0 left-0 h-full w-[336px]`}>
                        <ChatList />
                    </div>
                    <div
                        className="right absolute bg-base-100 top-0 right-0 h-full"
                        style={{ width: 'calc(100% - 336px)' }}
                    >
                        <RenderIf value={matchRootChat}>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <img
                                    loading="lazy"
                                    className="object-cover w-[80%] h-[80%]"
                                    src={icons.meow}
                                    alt={Math.random(0, 100)}
                                />
                                <span className="text-base-content font-semibold text-center">
                                    {t('container.quietMessage')}
                                </span>
                                <span className="text-base-content font-semibold text-center">
                                    {t('container.startConversation')}
                                </span>
                            </div>
                        </RenderIf>
                        <RenderIf value={!matchRootChat}>
                            <Outlet />
                        </RenderIf>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Container;
