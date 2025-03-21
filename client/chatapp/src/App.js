import { Route, Routes, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import PrivateRoute from './routes/PrivateRoute';
import { getMyInfo } from './redux/reducers/authSlice';
import PublicRoute from './routes/PublicRoute';
import cookieUtil from './utils/cookieUtils';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoadUser, setIsLoadUser] = useState(true);

    useEffect(() => {
        if (cookieUtil.getStorage()?.accessToken) {
            dispatch(getMyInfo())
                .unwrap()
                .then(() => {
                    setIsLoadUser(false);
                })
                .catch(() => {
                    navigate('/login');
                    setIsLoadUser(false);
                    window.location.reload();
                });
        } else {
            setIsLoadUser(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadRoute = (route, index) => {
        const Page = route.component;

        let Layout = DefaultLayout;
        if (route.layout) {
            Layout = route.layout;
        } else if (route.layout === null) {
            Layout = Fragment;
        }

        return (
            <Route
                key={index}
                element={
                    <Layout>
                        <Page />
                    </Layout>
                }
                path={route.path}
            ></Route>
        );
    };
    return (
        <>
            {!isLoadUser && (
                <Routes>
                    <Route element={<PublicRoute />}>{publicRoutes.map(loadRoute)}</Route>
                    <Route element={<PrivateRoute />}>{privateRoutes.map(loadRoute)}</Route>
                </Routes>
            )}
        </>
    );
}

export default App;
