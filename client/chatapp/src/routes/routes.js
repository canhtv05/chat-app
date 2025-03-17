import Home from '~/pages/Home';
import Message from '~/pages/Message';
import Auth from '~/pages/Auth';
import config from '~/configs';

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
        path: config.routes.messages,
        component: Message,
    },
];

export { publicRoutes, privateRoutes };
