import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const isAuth = useSelector((state) => state.auth.isAuth);

    return <>{isAuth ? <Outlet /> : <Navigate to={'/login'} />}</>;
}

export default PrivateRoute;
