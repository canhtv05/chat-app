import Home from '~/pages/Home';
import Message from '~/pages/Message';
import Auth from '~/pages/Auth';

const publicRoutes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/messages',
        component: Message,
    },
    {
        path: '/login',
        component: Auth,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
