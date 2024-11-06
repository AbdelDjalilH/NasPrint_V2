import { useState } from "react";
import { useCart } from "react-use-cart";
import axios from "axios";
import "../styles/cartModal.css";

export default function CartModal({ isOpen, onClose, productDetails }) {
  const { addItem, removeItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityById, setQuantityById] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [cartId, setCartId] = useState(1); // Ajouter un état dynamique pour cartId

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
    setQuantityById((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      return updatedQuantities;
    });

    try {
      await removeFromCart(cartId, productId);
      console.log("Produit supprimé de la base de données.");

      const newTotal = items.reduce(
        (acc, item) =>
          item.id !== productId
            ? acc + item.price * (quantityById[item.id] || item.quantity)
            : acc,
        0
      );

      await updateOrderAndPaymentTotal(newTotal);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
    }
  };

  const updateOrderAndPaymentTotal = async (newTotal) => {
    try {
      if (paymentId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/payments/${paymentId}`,
          {
            rising: newTotal,
            payment_date: new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            payment_mean: "carte",
            payment_status: "en cours",
          }
        );
        console.log("Total du paiement mis à jour :", newTotal);
      }

      if (orderId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
          user_id: 1,
          payment_id: paymentId,
          address_id: 1,
          order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
          order_status: "en cours",
          total_rising: newTotal,
        });
        console.log("Total de la commande mis à jour :", newTotal);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du total de la commande :",
        error
      );
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart_product`,
        {
          cart_id: cartId,
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
    const mysqlFormattedDate = now.toISOString().slice(0, 19).replace("T", " ");

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
      setPaymentId(paymentResponse.data.id);

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          user_id: 1,
          payment_id: paymentResponse.data.id,
          address_id: 1,
          order_date: mysqlFormattedDate,
          order_status: "en cours",
          total_rising: totalAmount,
        }
      );
      setOrderId(orderResponse.data.id);

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
              const subtotal = item.price * itemQuantity;

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
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button className="add-to-cart-btn" onClick={handleConfirm}>
              Ajouter au panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
