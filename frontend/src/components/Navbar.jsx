import { Link } from "react-router-dom";
import logoNas from "../assets/navImages/logoNas.png";
import panier from "../assets/navImages/panier.png";
import "../styles/navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "react-use-cart";
import { useState } from "react";
import menuIcon from "../assets/navImages/menuIcon.png";
import closeButton from "../assets/navImages/closeButton.png";

export default function Navbar({ toggleCartModal }) {
  const { auth, logout, user } = useAuth();
  const { totalItems } = useCart(); // Utilisation du hook pour récupérer le nombre total d'articles
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-container">
      <Link className="links-nav" to="/">
        <img src={logoNas} alt="Logo" />
      </Link>

      <div className="menu-container">
        <img
          className="menu-btn"
          src={menuOpen ? closeButton : menuIcon}
          onClick={() => setMenuOpen(!menuOpen)}
          alt="Menu"
        />
        <ul
          className={`menu-items ${menuOpen ? "menu-open" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <li>
            <Link to="/a-propos" className="links-nav">
              A propos
            </Link>
          </li>
          <li>
            <Link to="/nos-produits" className="links-nav">
              Nos produits
            </Link>
          </li>
          {auth ? (
            <>
              {user.role === "Administrateur" && (
                <li className="btn-li">
                  <Link to="/admin-page" className="secret-nav">
                    Admin
                  </Link>
                </li>
              )}
              <li className="btn-li">
                <Link onClick={logout} className="links-nav2">
                  Déconnexion
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="btn-li">
                <Link to="/inscription" className="links-nav2">
                  S'inscrire
                </Link>
              </li>
              <li className="btn-li">
                <Link to="/connexion" className="links-nav2">
                  Connexion
                </Link>
              </li>
            </>
          )}
          {auth && (
            <li className="btn-li">
              <Link to="/client-info" className="secret-nav">
                Infos Client
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div
        className="cart-container"
        onClick={toggleCartModal}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <img className="panier-img" src={panier} alt="Panier" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>
    </nav>
  );
}
