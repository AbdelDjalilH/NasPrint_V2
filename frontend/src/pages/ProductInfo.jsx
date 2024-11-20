import { useState, useEffect } from "react";
import "../styles/productInfo.css";
import axios from "axios";

function ProductInfo() {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    product_name: "",
    product_description: "",
    category_id: "",
    price: "",
    quantity_available: "",
    image_url: "default.png",
    height: "",
    length: "",
    weight: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);
  const ReFetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditProductData({
      product_name: product.product_name,
      product_description: product.product_description,
      category_id: product.category_id || "",
      price: product.price,
      quantity_available: product.quantity_available || "",
      image_url: product.image_url || "default.png",
      height: product.height,
      length: product.length,
      weight: product.weight,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isTokenValid = (token) => {
    const parts = token.split(".");
    return parts.length === 3;
  };

  const handleEditSubmit = async () => {
    if (!editProductId) return;
    const token = localStorage.getItem("token");

    if (!isTokenValid(token)) {
      console.error("Le token est manquant ou mal formé.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${editProductId}`,
        editProductData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Réponse de mise à jour:", response.data);
      setEditProductId(null);
      await ReFetchProducts();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      console.log("Produit supprimé avec succès");
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateProduct = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products`,
        editProductData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Nouveau produit créé:", response.data);
      await ReFetchProducts();
      resetEditForm();
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("Erreur API:", error.response.data);
      console.error("Statut de la réponse:", error.response.status);
    } else {
      console.error("Erreur de réseau ou autre:", error.message);
    }
  };

  const resetEditForm = () => {
    setEditProductId(null);
    setEditProductData({
      product_name: "",
      product_description: "",
      category_id: "",
      price: "",
      quantity_available: "",
      image_url: "default.png",
      height: "",
      length: "",
      weight: "",
    });
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">Gestion des produits</h2>
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              {editProductId === product.id ? (
                <div>
                  <input
                    type="text"
                    name="product_name"
                    value={editProductData.product_name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nom du produit"
                  />
                  <textarea
                    name="product_description"
                    value={editProductData.product_description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Description du produit"
                  ></textarea>
                  <input
                    type="number"
                    name="category_id"
                    value={editProductData.category_id}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="ID de la catégorie"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editProductData.price}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Prix"
                  />
                  <input
                    type="number"
                    name="quantity_available"
                    value={editProductData.quantity_available}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Quantité disponible"
                  />
                  <input
                    type="text"
                    name="image_url"
                    value={editProductData.image_url}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="URL de l'image"
                  />
                  <input
                    type="number"
                    name="height"
                    value={editProductData.height}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Hauteur"
                  />
                  <input
                    type="number"
                    name="length"
                    value={editProductData.length}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Longueur"
                  />
                  <input
                    type="number"
                    name="weight"
                    value={editProductData.weight}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Poids"
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="button button-green"
                      onClick={handleEditSubmit}
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="button button-gray"
                      onClick={resetEditForm}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-title">{product.product_name}</h3>
                  <p className="text-black mb-1">
                    <strong>Description:</strong> {product.product_description}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Prix:</strong> {product.price}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Quantité disponible:</strong>{" "}
                    {product.quantity_available}
                  </p>
                  <p className="text-black mb-1">
                    <strong>URL de l'image:</strong> {product.image_url}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Dimensions (HxL):</strong> {product.height} x{" "}
                    {product.length}
                  </p>
                  <p className="text-black mb-1">
                    <strong>Poids:</strong> {product.weight}
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="button button-green"
                      onClick={() => handleEditClick(product)}
                    >
                      Editer
                    </button>
                    <button
                      type="button"
                      className="button button-gray"
                      onClick={() => handleDelete(product.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="title">Créer un produit</h3>
          <input
            type="text"
            name="product_name"
            value={editProductData.product_name}
            onChange={handleInputChange}
            className="input"
            placeholder="Nom du produit"
          />
          <textarea
            name="product_description"
            value={editProductData.product_description}
            onChange={handleInputChange}
            className="input"
            placeholder="Description du produit"
          ></textarea>
          <input
            type="number"
            name="category_id"
            value={editProductData.category_id}
            onChange={handleInputChange}
            className="input"
            placeholder="ID de la catégorie"
          />
          <input
            type="number"
            name="price"
            value={editProductData.price}
            onChange={handleInputChange}
            className="input"
            placeholder="Prix"
          />
          <input
            type="number"
            name="quantity_available"
            value={editProductData.quantity_available}
            onChange={handleInputChange}
            className="input"
            placeholder="Quantité disponible"
          />
          <input
            type="text"
            name="image_url"
            value={editProductData.image_url}
            onChange={handleInputChange}
            className="input"
            placeholder="URL de l'image"
          />
          <input
            type="number"
            name="height"
            value={editProductData.height}
            onChange={handleInputChange}
            className="input"
            placeholder="Hauteur"
          />
          <input
            type="number"
            name="length"
            value={editProductData.length}
            onChange={handleInputChange}
            className="input"
            placeholder="Longueur"
          />
          <input
            type="number"
            name="weight"
            value={editProductData.weight}
            onChange={handleInputChange}
            className="input"
            placeholder="Poids"
          />
          <button
            type="button"
            className="button button-green"
            onClick={handleCreateProduct}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
