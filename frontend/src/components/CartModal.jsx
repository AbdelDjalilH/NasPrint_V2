import React, { useState } from "react";
import { useCart } from "react-use-cart";
import axios from "axios";
import "../styles/cartModal.css";

export default function CartModal({ isOpen, onClose, productDetails }) {
  const { addItem, removeItem, items, emptyCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityById, setQuantityById] = useState({});

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (productDetails) {
      addItem({
        id: productDetails.id,
        product_name: productDetails.product_name,
        price: productDetails.price,
        quantity,
        image_url: productDetails.image_url,
      });

      // Mise à jour de quantityById avec la quantité du produit ajouté
      setQuantityById((prevQuantities) => ({
        ...prevQuantities,
        [productDetails.id]: quantity,
      }));

      try {
        await addToCart(productDetails.id, quantity);
        console.log("Produit ajouté au panier.");
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
      }

      onClose();
    }
  };

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

  const handleRemove = async (productId) => {
    removeItem(productId);

    // Supprime également la quantité du produit retiré de quantityById
    setQuantityById((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });

    try {
      await removeFromCart(1, productId);
      console.log("Produit supprimé de la base de données.");
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart_product`,
        {
          cart_id: 1,
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

  const createOrderAndPayment = async () => {
    const now = new Date();
    const mysqlFormattedDate = now.toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:MM:SS

    const totalAmount = items.reduce(
      (acc, item) =>
        acc + item.price * (quantityById[item.id] || item.quantity),
      0
    );

    try {
      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        {
          rising: totalAmount,
          payment_date: mysqlFormattedDate,
          payment_mean: "carte",
          payment_status: "en cours",
          user_id: 1,
        }
      );

      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        user_id: 1,
        payment_id: paymentResponse.data.id,
        address_id: 1,
        order_date: mysqlFormattedDate,
        order_status: "en cours",
        total_rising: totalAmount,
      });

      console.log("Nouvelle commande et paiement créés.");
    } catch (error) {
      console.error(
        "Erreur lors de la création de la commande et du paiement :",
        error
      );
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (quantityById[item.id] || item.quantity),
    0
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Votre panier</h2>
        <hr />

        {items.length > 0 ? (
          <div>
            {items.map((item) => {
              const itemQuantity = quantityById[item.id] || item.quantity;
              const subtotal = item.price * itemQuantity; // Calcul du sous-total

              return (
                <div key={item.id} className="product-cart-data">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="img-product-modal"
                  />
                  <p>{item.product_name}</p>
                  <p>Prix unitaire : {item.price} €</p>
                  <p>Quantité : {itemQuantity}</p>
                  <p>Sous-total : {subtotal} €</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    Supprimer
                  </button>
                  <hr />
                </div>
              );
            })}
            <h3>Total : {totalPrice} €</h3>
          </div>
        ) : (
          <p>Votre panier est vide.</p>
        )}

        {items.length > 0 && (
          <button className="empty-cart-btn" onClick={emptyCart}>
            Vider le panier
          </button>
        )}

        <button className="confirm-order-btn" onClick={createOrderAndPayment}>
          Confirmer la commande
        </button>

        {productDetails && (
          <div>
            <h4>Ajouter un autre produit</h4>
            <div>
              <label>Quantité : </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
                min="1"
              />
            </div>
            <button onClick={handleConfirm}>Ajouter au panier</button>
          </div>
        )}
      </div>
    </div>
  );
}
