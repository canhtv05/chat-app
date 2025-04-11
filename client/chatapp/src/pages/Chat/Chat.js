import Container from '~/layouts/components/Container';
import MenuSidebar from '~/layouts/components/MenuSidebar';

function Chat() {
    return (
        <>
            <div className="left w-[78px]">
                <MenuSidebar />
            </div>
            <div className="right w-full">
                <Container />
            </div>
        </>
    );
}

export default Chat;
