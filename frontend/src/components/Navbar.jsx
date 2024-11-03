import { Link } from "react-router-dom";
import logoNas from "../assets/navImages/logoNas.png";
import panier from "../assets/navImages/panier.png";
import "../styles/navbar.css";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ toggleCartModal, cartItemCount }) {
  // Ajoutez cartItemCount en prop
  const { auth, logout, user } = useAuth();

  return (
    <nav className="navbar-container">
      <Link className="links-nav" to="/">
        <img src={logoNas} alt="Logo" />
      </Link>

      <Link to="/a-propos" className="links-nav">
        A propos
      </Link>

      <Link to="/nos-produits" className="links-nav">
        Nos produits
      </Link>

      {auth && user.role === "Administrateur" ? (
        <>
          <Link to="/admin-page" className="secret-nav">
            Admin
          </Link>
          <Link onClick={logout} className="links-nav2">
            Déconnexion
          </Link>
        </>
      ) : (
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
        </ul>
      )}

      {auth && (
        <Link to="/client-Info" className="secret-nav">
          Infos Client
        </Link>
      )}

      {/* L'icône panier déclenche toggleCartModal lorsqu'elle est cliquée */}
      <div
        className="cart-container"
        onClick={toggleCartModal}
        style={{ cursor: "pointer" }}
      >
        <img className="panier-img" src={panier} alt="Panier" />
        {/* Affichage du compteur dans un cercle si cartItemCount > 0 */}
        {cartItemCount > 0 && (
          <span className="cart-count">{cartItemCount}</span>
        )}
      </div>
    </nav>
  );
}
