import { Link } from "react-router-dom";
import logoNas from "../assets/navImages/logoNas.png";
import panier from "../assets/navImages/panier.png";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <Link className="links-nav" to="/">
        <img src={logoNas} alt="" />
      </Link>

      <Link to="/a-propos" className="links-nav">
        A propos
      </Link>

      <Link to="/nos-produits" className="links-nav">
        Nos produits
      </Link>

      <ul className="list-2boutons">
        <li>
          <Link to="/inscription" className="links-nav2">
            S'inscrire
          </Link>
        </li>
        <li>
          <Link to="/connexion" className="links-nav2">
            Connexion
          </Link>
        </li>
        <li>
          <img className="panier-img" src={panier} alt="" />
        </li>
      </ul>
    </nav>
  );
}
