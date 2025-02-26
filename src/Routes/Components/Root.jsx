import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";


const Root = () => {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <>
            <NavBar scrollToSection={scrollToSection}></NavBar>
            <div className="main-bg">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

        </>
    );
};

export default Root;