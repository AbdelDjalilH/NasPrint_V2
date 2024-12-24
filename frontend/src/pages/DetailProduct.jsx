import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/detailproduct.css";
import SliderProducts from "../components/SliderProducts";

export default function DetailProduct() {
  const { id } = useParams();
  const { openCartModalWithProduct } = useOutletContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState([]); // Liste de tous les produits

  const next = "|  Suivant  >";
  const previous = "<  Précédent  ";

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

    const fetchProductList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProductList(response.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération de la liste des produits.",
          err
        );
      }
    };

    fetchProduct();
    fetchProductList();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      openCartModalWithProduct(product);
    }
  };

  const handlePrevious = () => {
    const currentId = parseInt(id);
    if (currentId === 1) {
      const maxId = Math.max(...productList.map((p) => p.id)); // Trouver le plus grand ID
      navigate(`/nos-produits/${maxId}`);
    } else {
      navigate(`/nos-produits/${currentId - 1}`);
    }
  };

  const handleNext = () => {
    const currentId = parseInt(id);
    const maxId = Math.max(...productList.map((p) => p.id)); // Trouver le plus grand ID
    if (currentId === maxId) {
      navigate(`/nos-produits/1`); // Aller à l'ID 1
    } else {
      navigate(`/nos-produits/${currentId + 1}`);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Produit introuvable.</p>;

  return (
    <div className="detail-product-container">
      <nav className="navigation-buttons">
        <button onClick={handlePrevious}>{previous}</button>
        <button onClick={handleNext}>{next}</button>
      </nav>
      <section className="img-container-row-section">
        <section className="img-container">
          <SliderProducts id={id} />
        </section>

        <section className="row-section">
          {/* Retiré l'image actuelle et remplacé par le slider */}
          <section className="column-section1">
            <h1 className="detail-product-name">{product.product_name}</h1>

            <p className="detail-product-price">Prix: {product.price} €</p>
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Ajouter au panier
            </button>
            <p className="detail-product-description">
              {product.product_description}
            </p>
          </section>
        </section>
      </section>
    </div>
  );
}
