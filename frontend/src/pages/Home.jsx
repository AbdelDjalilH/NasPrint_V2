import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Slider";
import Product from "../components/Product.jsx";
import "../styles/home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);

  const getRandomProducts = (productsList, count) => {
    const shuffled = [...productsList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    // Charger les produits depuis l'API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(response.data);
        setRandomProducts(getRandomProducts(response.data, 4)); // 4 produits aléatoires
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <section className="slider-container"></section>
      <Slider />
      <section className="nouveautes-container">
        <h2 className="nouveaute-title">Quelques produits</h2>
        <div className="nouveautees-product">
          {randomProducts.map((product) => (
            <Product key={product.id} product={product} id={product.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
