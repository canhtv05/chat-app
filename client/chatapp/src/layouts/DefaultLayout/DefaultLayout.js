import images from '~/assets/images';
import Sidebar from '../components/Sidebar/Sidebar';
import Aside from '../components/Aside/Aside';

function DefaultLayout({ children }) {
    return (
        <div className="relative">
            <img src={images.background} alt="div" className="w-full h-screen object-cover" />
            <div className="flex w-full top-0 left-0 absolute h-full p-10">
                <div className="border-border border w-full overflow-hidden relative rounded-xl flex items-center justify-center">
                    <img
                        src={images.background}
                        alt="div"
                        className="w-full h-full object-cover absolute blur-lg z-0"
                    />
                    <div className="flex h-full absolute z-10 w-full">
                        <div className="left w-[5%]">
                            <Sidebar />
                        </div>
                        <div className="right w-full">
                            <Aside />
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
