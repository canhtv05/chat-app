import HomePage from '~/pages/Home/HomPage';
import MessagePage from '~/pages/MessagePage/MessagePage';

const publicRoutes = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/messages',
        component: MessagePage,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
