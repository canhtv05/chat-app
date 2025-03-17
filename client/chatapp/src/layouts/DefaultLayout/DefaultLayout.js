import { useSelector } from 'react-redux';
import images from '~/assets/images';

function DefaultLayout({ children }) {
    const isAuth = useSelector((state) => state.auth.isAuth);

    return (
        <div className="relative">
            <img src={images.background} alt="div" className="w-full h-screen object-cover" />
            <div className="flex w-full top-0 left-0 absolute h-full p-10">
                <div
                    className={`${
                        isAuth && 'border-border border'
                    } w-full overflow-hidden relative rounded-xl flex items-center justify-center`}
                >
                    {isAuth && (
                        <img
                            src={images.background}
                            alt="div"
                            className="w-full h-full object-cover absolute blur-lg z-0"
                        />
                    )}
                    <div className="flex h-full absolute z-10 w-full">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
