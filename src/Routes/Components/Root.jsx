import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";


const Root = () => {
    return (
        <>
            <NavBar></NavBar>
            <div className="main-bg">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

        </>
    );
};

export default Root;