const Carousel = () => {
    return (
        <div className="carousel w-full ">
            <div id="slide1" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/4R6Jrk4C/meeting-group-marketing-experts-1409-7697.jpg"
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-cover "
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide4" className="btn btn-circle">❮</a>
                    <a href="#slide2" className="btn btn-circle">❯</a>
                </div>
            </div>

            <div id="slide2" className="carousel-item relative w-full">
                <img
                    src="https://img.freepik.com/free-photo/man-using-laptop-wooden-table_587448-8122.jpg?t=st=1740499148~exp=1740502748~hmac=152e83af907c3bec2363aef9956f867fc4411ea5599f36a82a8167e3bba1e6bd&w=1380"
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-fill "
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn btn-circle">❮</a>
                    <a href="#slide3" className="btn btn-circle">❯</a>
                </div>
            </div>

            <div id="slide3" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/Qv4FLmB5/science-lab-process-chart-diagram-sketch-53876-127454.jpg"
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-fill "
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle">❮</a>
                    <a href="#slide4" className="btn btn-circle">❯</a>
                </div>
            </div>

            <div id="slide4" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/N6hM2FbT/businesspeople-meeting-plan-analysis-graph-company-finance-strat-74952-1347.jpg"
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-fill "
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn btn-circle">❮</a>
                    <a href="#slide1" className="btn btn-circle">❯</a>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
