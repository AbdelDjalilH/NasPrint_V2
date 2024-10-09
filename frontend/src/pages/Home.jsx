import Slider from "../components/Slider";
import "../styles/home.css";
// import dataAllproducts from "../data/sliderHome.js";
import img1 from "../assets/homeImages/img1.png";
import img2 from "../assets/homeImages/img2.png";
import img3 from "../assets/homeImages/img3.png";
import img4 from "../assets/homeImages/img4.png";
import img5 from "../assets/homeImages/img5.png";

export default function Home() {
  return (
    <div>
      <section className="slider-container"></section>
      <Slider />
      <section className="nouveautes-container">
        <h2 className="nouveaute-title">Nouveautées</h2>
        <div className="nouveautees-product">
          <div className="nouveaute-one">
            <img className="firstimage" src={img1} alt="" />
            <h3 className="titlefirst-one">Décoration murale - Aid Moubarak</h3>
            <p className="price1st-one">15.00€</p>
          </div>
          <div className="nouveaute-two">
            <img className="secondimage" src={img2} alt="" />
            <h3 className="titlesecond-two">
              Décoration murale - Aid Moubarak
            </h3>
            <p className="price2st-two">12.00€</p>
          </div>
        </div>
      </section>
      <section className="bestSells-container">
        <h2 className="bestSells-title">Les meilleures ventes</h2>
        <div className="bestSells-product">
          <div className="bestSells-one">
            <img className="thirdImage" src={img3} alt="" />
            <h3 className="titlethird-three">
              Décoration murale - Aid Moubarak
            </h3>
            <p className="price3rd-three">7.00€</p>
          </div>
          <div className="bestSells-two">
            <img className="fourImage" src={img4} alt="" />
            <h3 className="titleFour-four">Décoration murale - Aid Moubarak</h3>
            <p className="price4st-four">5.00€</p>
          </div>
          <div className="bestSells-three">
            <img className="fiveImage" src={img5} alt="" />
            <h3 className="titleFive-five">Décoration murale - Aid Moubarak</h3>
            <p className="price5st-five">15.00€</p>
          </div>
        </div>
      </section>
    </div>
  );
}
