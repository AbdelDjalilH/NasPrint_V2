import { NavLink } from "react-router-dom";
import "../styles/product.css";

export default function Product({ product }) {
  return (
    <NavLink to={`/produits/${product.id}`} className="product-link">
      <div className="product-container">
        <img
          className="product-image"
          src={product.image}
          alt={product.title}
        />
        <ul className="product-info">
          <li className="product-title">{product.title}</li>
          <li className="product-category">{product.category}</li>
          <li className="product-price">{product.price.toFixed(2)} €</li>
        </ul>
        <button className="product-btn">En savoir plus</button>
      </div>
    </NavLink>
  );
}
