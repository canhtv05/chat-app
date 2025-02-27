import Header from '../Header/Header';
import Article from './Article/Article';
import Main from './Main/Main';

function Aside() {
    return (
        <div className="h-full">
            <Header username={'Còn cái nịt'} />
            <div className="flex w-full h-full">
                <div className="left w-[25%]">
                    <Article />
                </div>
                <div className="right w-[75%]">
                    <Main />
                </div>
            </div>
        </div>
    );
}

export default Aside;
