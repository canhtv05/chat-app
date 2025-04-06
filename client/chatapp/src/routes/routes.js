import Home from '~/pages/Home';
import Auth from '~/pages/Auth';
import config from '~/configs';
import Chat from '~/pages/Chat';

const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.login,
        component: Auth,
    },
];

const privateRoutes = [
    {
        path: config.routes.chats,
        component: Chat,
    },
];

export { publicRoutes, privateRoutes };
