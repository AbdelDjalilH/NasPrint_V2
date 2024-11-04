import React, { useState } from "react";
import { useCart } from "react-use-cart";
import axios from "axios"; // Assurez-vous d'importer axios pour faire des requêtes
import "../styles/cartModal.css";

export default function CartModal({ isOpen, onClose, productDetails }) {
  const { addItem, removeItem } = useCart(); // Utilisez removeItem pour supprimer un produit
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

  // Nouvelle fonction pour supprimer du panier
  // Nouvelle fonction pour supprimer du panier
  const handleRemove = async () => {
    if (productDetails) {
      const cartId = 1; // Assurez-vous que cart_id est bien défini selon votre logique
      const productId = productDetails.id;

      // Supprimez le produit du panier avec l'ID
      removeItem(productId);

      // Envoyer une requête DELETE pour retirer de la table cart_products
      try {
        await removeFromCart(cartId, productId);
        console.log("Produit supprimé de la base de données.");
      } catch (error) {
        console.error("Erreur lors de la suppression du panier :", error);
      }

      onClose(); // Fermez la modal après la suppression
    }
  };

  // Fonction pour supprimer de la table cart_products
  // Fonction pour supprimer de la table cart_products
  const removeFromCart = async (cartId, productId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart_product/${cartId}/${productId}`
      );
      console.log("Réponse de suppression :", response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression dans la base de données :",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        "Erreur lors de la suppression du panier dans la base de données"
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Votre panier</h2>
        <hr />
        {productDetails && (
          <div className="product-cart-data">
            <p>{productDetails.product_name}</p>
            <p>Prix : {productDetails.price} €</p>
            <img src={productDetails.image_url} className="img-product-modal" />
            <div></div>
            <section className="qte-boutons">
              <label>Quantité </label>
              <input
                className="qte-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                min="1"
              />
              <button className="remove-btn" onClick={handleRemove}>
                Supprimer
              </button>
            </section>
            <hr />
            <button className="validate-btn" onClick={handleConfirm}>
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
