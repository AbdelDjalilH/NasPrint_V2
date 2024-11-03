// DetailProduct.jsx
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import "../styles/detailproduct.css";

export default function DetailProduct() {
  const { id } = useParams();
  const { openCartModalWithProduct } = useOutletContext(); // Récupérer openCartModalWithProduct depuis le contexte
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération du produit.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      openCartModalWithProduct(product); // Ouvre la modal avec les détails du produit
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Produit introuvable.</p>;

  return (
    <div className="detail-product-container">
      <section className="row-section">
        <img
          className="detail-product-main-img"
          src={product.image_url}
          alt={product.product_name}
        />
        <section className="column-section1">
          <h1 className="detail-product-name">{product.product_name}</h1>
          <p className="detail-product-price">Prix: {product.price} €</p>

          <button onClick={handleAddToCart} className="add-to-cart-button">
            Ajouter au panier
          </button>
        </section>
      </section>

      <section className="column-section2">
        <p className="detail-product-description">
          {product.product_description}
        </p>
      </section>
    </div>
  );
}
