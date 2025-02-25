import Carousel from "../Carousel/Carousel";
import AboutTrackWise from "../Home/AboutTrackWise/AboutTrackWise";
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
            
        </div>
    );
};

export default Home;