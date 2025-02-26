import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';

function App() {
    return (
        <>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;

                    const Layout = Fragment;

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
            <Routes>
                {privateRoutes.map((route, index) => {
                    const Page = route.component;

                    const Layout = Fragment;

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
