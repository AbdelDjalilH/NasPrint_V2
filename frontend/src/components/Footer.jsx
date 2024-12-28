import { Link } from "react-router-dom";
import "../styles/footer.css";
import madeInFrance from "../assets/footerImages/madeInFrance.png";
import instagram from "../assets/footerImages/instagram.png";
import facebook from "../assets/footerImages/facebook.png";
import linkedin from "../assets/footerImages/linkedin.png";
import pinterest from "../assets/footerImages/pinterest.png";
import biodegradable from "../assets/footerImages/biodegradable.png";

export default function Footer() {
  return (
    <footer className="footer-container">
      <section className="first-section">
        <img src={madeInFrance} alt="madeinfrance" />
        <img
          className="biodegradable-img"
          src={biodegradable}
          alt="biodegradable"
        />
        <div className="socialNetworksLogos">
          <img src={instagram} alt="instagram" />
          <img src={facebook} alt="facebook" />
          <img src={linkedin} alt="linkedin" />
          <img src={pinterest} alt="pinterest" />
        </div>
      </section>
      <section className="second-section">
        <p className="contact-sentence">
          Des demandes ou des idées sur nos produits?
        </p>
        <Link to="/contact-page" className="contact-btn">
          Nous contacter
        </Link>
      </section>
      <section className="last-section">
        <hr className="hr" />
        <div className="links-footer">
          <a className="link-footer" href="">
            FAQ
          </a>
          <a className="link-footer" href="">
            Politique de cookies
          </a>
          <a className="link-footer" href="">
            Livraisons et retours
          </a>
          <a className="link-footer" href="">
            Moyents de paiement
          </a>
          <a className="link-footer" href="">
            Politique de boutique
          </a>
          <a className="link-footer" href="">
            Mentions légales
          </a>
        </div>
        <hr />
        <p className="copyright">Fait par ADJ en 2024</p>
      </section>
    </footer>
  );
}
