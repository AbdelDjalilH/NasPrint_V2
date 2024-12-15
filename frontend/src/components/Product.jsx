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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  // Déterminer la source de l'image (lien ou chemin local)
  const getImageSrc = (imagePath) => {
    if (!imagePath) {
      return "/path/to/default-image.jpg"; // Image par défaut
    }

    // Si l'image commence par "http" ou "https", utilisez-la directement
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Sinon, concaténez avec la base URL locale
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  return (
    <NavLink to={`/nos-produits/${product.id}`} className="product-link">
      <div className="product-container">
        <img
          className="product-image"
          src={getImageSrc(images.first_image)} // Appel de la logique pour déterminer la source
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
