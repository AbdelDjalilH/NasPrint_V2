// components/CartModal.jsx
import React, { useState } from "react";
import { useCart } from "react-use-cart";
import axios from "axios"; // Assurez-vous d'importer axios pour faire des requêtes
import "../styles/cartModal.css";

export default function CartModal({ isOpen, onClose, productDetails }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1); // État pour la quantité

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (productDetails) {
      // Ajoutez le produit au panier avec les détails
      addItem({
        id: productDetails.id,
        product_name: productDetails.product_name,
        price: productDetails.price,
        quantity,
      });

      // Envoyer une requête POST pour ajouter à la table cart_products
      try {
        await addToCart(productDetails.id, quantity); // Remplacez le cart_id par celui approprié
        console.log("Produit ajouté à la base de données.");
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
      }

      onClose(); // Fermez la modal après validation
    }
  };

  // Fonction pour ajouter à la table cart_products
  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart_product`, // Votre endpoint API
        {
          cart_id: 1, // Changez cela selon votre logique
          product_id: productId,
          quantity: quantity,
        }
      );
      console.log(response.data);
    } catch (error) {
      throw new Error(
        "Erreur lors de l'ajout au panier dans la base de données"
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Ajouter au Panier</h2>
        {productDetails && (
          <div>
            <p>{productDetails.product_name}</p>
            <p>Prix : {productDetails.price} €</p>
            <div>
              <label>Quantité :</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                min="1"
              />
            </div>
            <button onClick={handleConfirm}>Valider</button>
          </div>
        )}
      </div>
    </div>
  );
}
