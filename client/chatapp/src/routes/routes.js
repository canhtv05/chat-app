import { lazy } from 'react';
import config from '~/configs';

const Home = lazy(() => import('~/pages/Home'));
const Auth = lazy(() => import('~/pages/Auth'));
const Chat = lazy(() => import('~/pages/Chat'));

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
