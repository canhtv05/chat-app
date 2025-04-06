import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
    const isAuth = useSelector((state) => state.auth.isAuth);

    return isAuth ? <Navigate to="/chats" replace /> : <Outlet />;
}

export default PublicRoute;
