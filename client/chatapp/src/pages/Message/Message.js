import Container from '~/layouts/components/Container';
import MenuSidebar from '~/layouts/components/MenuSidebar';

function Message() {
    return (
        <>
            <div className="left w-[5%]">
                <MenuSidebar />
            </div>
            <div className="right w-full">
                <Container />
            </div>
        </>
    );
}

export default Message;
