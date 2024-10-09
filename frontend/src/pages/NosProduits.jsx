import { useEffect, useState } from "react";
import dataAllproducts from "../data/dataProducts.js";
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
    setProducts(dataAllproducts);
    setFilteredProducts(dataAllproducts);
  }, []);

  useEffect(() => {
    if (category === "Tous les produits" || category === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
  }, [category, products]);

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
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
