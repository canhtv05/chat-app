import Aside from '~/layouts/components/Aside/Aside';
import Sidebar from '~/layouts/components/Sidebar/Sidebar';

function MessagePage() {
    return (
        <>
            <div className="left w-[5%]">
                <Sidebar />
            </div>
            <div className="right w-full">
                <Aside />
            </div>
        </>
    );
}

export default MessagePage;
