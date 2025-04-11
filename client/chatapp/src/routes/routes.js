import { lazy } from 'react';
import config from '~/configs';

const Home = lazy(() => import('~/pages/Home'));
const Auth = lazy(() => import('~/pages/Auth'));
const Chat = lazy(() => import('~/pages/Chat'));
const Settings = lazy(() => import('~/pages/Settings'));
const Profile = lazy(() => import('~/components/Profile/Profile'));

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

const modals = [
    {
        path: config.routes.modals.settings,
        component: Settings,
    },
    {
        path: config.routes.modals.profile,
        component: Profile,
    },
];

export { publicRoutes, privateRoutes, modals };
