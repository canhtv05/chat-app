import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';

import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';

function App() {
    return (
        <>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;

                    const Layout = DefaultLayout;

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
