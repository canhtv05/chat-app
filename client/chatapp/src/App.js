import { Route, Routes } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';

import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import PrivateRoute from './routes/PrivateRoute';
import useLocalStorage from './hooks/useLocalStorage';
import { useDispatch } from 'react-redux';
import { getMyInfo } from './redux/reducers/authSlice';

function App() {
    const { dataStorage } = useLocalStorage();
    const dispatch = useDispatch();

    const [isLoadUser, setIsLoadUser] = useState(true);

    useEffect(() => {
        if (dataStorage?.token) {
            const loadUser = dispatch(getMyInfo(dataStorage.token));

            loadUser.finally(() => {
                setIsLoadUser(false);
            });
        } else {
            setIsLoadUser(true);
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
            {/* {isLoadUser ? null : ( */}
            <Routes>
                {publicRoutes.map(loadRoute)}
                <Route element={<PrivateRoute />}>{privateRoutes.map(loadRoute)}</Route>
            </Routes>
            {/* )} */}
        </>
    );
}

export default App;
