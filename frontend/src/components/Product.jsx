import { NavLink } from "react-router-dom";
import "../styles/product.css";

export default function Product({ product }) {
  return (
    <NavLink to={`/nos-produits/${product.id}`} className="product-link">
      <div className="product-container">
        <img
          className="product-image"
          src={product.image_url || "/path/to/default-image.jpg"} // Affiche une image par défaut si image_url est manquant
          alt={product.product_name || "Produit"}
        />
        <ul className="product-info">
          <li className="product-title">
            {product.product_name || "Nom du produit"}
          </li>
          <li className="product-category">
            {getCategoryName(product.category_id)}
          </li>
          <li className="product-price">
            {product.price || "Prix non disponible"} €
          </li>
        </ul>
        <button className="product-btn">En savoir plus</button>
      </div>
    </NavLink>
  );
}

// Fonction pour récupérer le nom de la catégorie à partir de l'ID
function getCategoryName(categoryId) {
  const categories = {
    1: "Collection Art de Table",
    2: "Collection Art Mural",
    3: "Evénements & fêtes",
    // Ajoutez d'autres catégories ici si nécessaire
  };
  return categories[categoryId] || "Catégorie inconnue";
}
