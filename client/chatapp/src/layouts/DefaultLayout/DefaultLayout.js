import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import images from '~/assets/images';
import ModalLoading from '~/components/Modals/ModalLoading';
import useWindowSize from '~/hooks/useWindowSize';

function DefaultLayout({ children }) {
    const isAuth = useSelector((state) => state.auth.isAuth);
    const { theme } = useSelector((state) => state.theme);
    const { loading } = useSelector((state) => state.event);
    const { width } = useWindowSize();

    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    return (
        <ModalLoading loading={loading}>
            <div className="relative">
                <img loading="lazy" src={images.background} alt="div" className="w-full h-screen object-cover" />
                <div className={`flex w-full top-0 left-0 absolute h-full ${width < 1024 ? 'p-2' : 'p-10'}`}>
                    <div className={`w-full overflow-hidden relative rounded-xl flex items-center justify-center`}>
                        {isAuth && (
                            <img
                                loading="lazy"
                                src={images.background}
                                alt="div"
                                className="w-full h-full object-cover absolute blur-lg z-0"
                            />
                        )}
                        <div className="flex h-full absolute z-10 w-full">{children}</div>
                    </div>
                </div>
            </div>
        </ModalLoading>
    );
}

export default DefaultLayout;
