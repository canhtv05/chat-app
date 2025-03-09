import { Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';

import { publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';

function App() {
    return (
        <>
            <Routes>
                {publicRoutes.map((route, index) => {
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
                })}
            </Routes>
        </>
    );
}

export default App;
