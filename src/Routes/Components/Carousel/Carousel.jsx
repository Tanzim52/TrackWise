const Carousel = () => {
    return (
        <div className="carousel w-full ">
            <div id="slide1" className="carousel-item relative w-full">
                <img
                    src="https://img.freepik.com/free-photo/closeup-shot-entrepreneur-working-from-home-his-personal-finances-savings_181624-21934.jpg?t=st=1740497122~exp=1740500722~hmac=9277dfe3da37cf16b5f8cf20e6643ab13a6504f8239bc296a037766e1cd9eb54&w=1380"
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
                    src="https://img.freepik.com/free-photo/science-lab-process-chart-diagram-sketch_53876-127454.jpg?t=st=1740499431~exp=1740503031~hmac=c2ae5f17f7e7bcf7ae79e0a4da67cc6604219f293d342dd653779ec891daa4f7&w=2000"
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-fill "
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle">❮</a>
                    <a href="#slide4" className="btn btn-circle">❯</a>
                </div>
            </div>

            <div id="slide4" className="carousel-item relative w-full">
                <img
                    src="https://img.freepik.com/free-photo/businesspeople-meeting-plan-analysis-graph-company-finance-strat_74952-1347.jpg?t=st=1740499525~exp=1740503125~hmac=2277df71286355a324c0666ca004c3a50c4397424f8f6f2306891448c23be037&w=2000"
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
