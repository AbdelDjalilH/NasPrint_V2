import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product.jsx";
import "../styles/nosProduits.css";

export default function NosProduits() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");

  const categories = [
    "Tous les produits",
    "Collection Art de Table",
    "Collection Art Mural",
    "Evenements & fêtes",
  ];

  useEffect(() => {
    // Requête pour récupérer les produits depuis le backend avec axios
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(response.data); // Assigne les produits récupérés
        setFilteredProducts(response.data); // Filtrage initial
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === "Tous les produits" || category === "") {
      setFilteredProducts(products);
    } else {
      const selectedCategoryIndex = categories.indexOf(category);
      setFilteredProducts(
        products.filter(
          (product) => product.category_id === selectedCategoryIndex
        )
      );
    }
  }, [category, products]); // products dépend aussi du nouvel upload

  return (
    <div className="nosProduits-container">
      <h1 className="title-nosProduits">Découvrez nos produits 🤩</h1>

      <div className="filter-container">
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="products-container">
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} id={product.id} />
        ))}
      </div>
    </div>
  );
}
