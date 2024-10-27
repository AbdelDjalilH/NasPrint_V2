import { Link } from "react-router-dom";
import logoNas from "../assets/navImages/logoNas.png";
import panier from "../assets/navImages/panier.png";
import "../styles/navbar.css";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { auth, logout } = useAuth();

  return (
    <nav className="navbar-container">
      {auth ? (
        <>
          <Link to="/secret-page" className="secret-nav">
            Page secrète
          </Link>

          <Link className="links-nav" to="/">
            <img src={logoNas} alt="Logo" />
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
              <Link
                to="/connexion"
                onClick={() => logout()}
                className="connexion-btn"
              >
                Deconnexion
              </Link>
            </li>
            <li>
              <img className="panier-img" src={panier} alt="Panier" />
            </li>
          </ul>
        </>
      ) : (
        <>
          <Link className="links-nav" to="/">
            <img src={logoNas} alt="Logo" />
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
              <img className="panier-img" src={panier} alt="Panier" />
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}
