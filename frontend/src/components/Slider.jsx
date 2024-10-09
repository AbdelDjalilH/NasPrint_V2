import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "../styles/slider.css";
import datasSlider from "../data/dataCarousel";

export default function Slider() {
  return (
    <div className="carousel-container">
      <Carousel showThumbs={false} autoPlay interval={6000} infiniteLoop>
        {datasSlider.map((slide) => (
          <div key={slide.id}>
            <img src={slide.image} alt={slide.title} />
            <div className="overlay">
              <h3 className="overlay_title">{slide.title}</h3>
              <button className="btn-decouvrir">Découvrir</button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
