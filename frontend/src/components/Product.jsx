import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/product.css";
import axios from "axios";

function getCategoryName(categoryId) {
  const categories = {
    1: "Collection Art de Table",
    2: "Collection Art Mural",
    3: "Evenements & fêtes",
  };
  return categories[categoryId] || "Catégorie inconnue";
}

export default function Product({ product, id }) {
  const [images, setImages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/images/${id}`
        );
        console.log("Données récupérées : ", response.data);

        const data = response.data;
        if (data && typeof data === "object") {
          setImages(data);
        } else {
          console.warn(
            "Les données reçues ne sont pas un objet :",
            response.data
          );
          setImages({});
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des images :", err);
        setError(`Erreur: ${err.message} (code: ${err.code || "inconnu"})`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImages();
    }
  }, [id]);

  // Afficher un message de chargement ou d'erreur si nécessaire
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <NavLink to={`/nos-produits/${product.id}`} className="product-link">
      <div className="product-container">
        <img
          className="product-image"
          src={
            (`http://localhost:3335/images/` && images.first_image) ||
            "/path/to/default-image.jpg"
          } // Affiche une image par défaut si first_image est manquant
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
