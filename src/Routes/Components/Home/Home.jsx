import Carousel from "../Carousel/Carousel";
import AboutTrackWise from "../Home/AboutTrackWise/AboutTrackWise";
import Contact from "./Contact/Contact";
import FAQ from "./FAQ/FAQ";
import HowItWorks from "./How it works/HowItWorks";
import Reviews from "./Reviews/Reviews";


const Home = () => {
    return (
        <div>
            <Carousel></Carousel>
            <AboutTrackWise></AboutTrackWise>
            <HowItWorks></HowItWorks>
            <FAQ></FAQ>
            <Reviews></Reviews>
            <Contact></Contact>
            
        </div>
    );
};

export default Home;