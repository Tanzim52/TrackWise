import Carousel from "../Carousel/Carousel";
import AboutTrackWise from "../Home/AboutTrackWise/AboutTrackWise";
import FAQ from "./FAQ/FAQ";
import HowItWorks from "./How it works/HowItWorks";


const Home = () => {
    return (
        <div>
            <Carousel></Carousel>
            <AboutTrackWise></AboutTrackWise>
            <HowItWorks></HowItWorks>
            <FAQ></FAQ>
            
        </div>
    );
};

export default Home;