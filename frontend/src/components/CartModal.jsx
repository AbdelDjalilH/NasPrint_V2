import { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import axios from "axios";
import "../styles/cartModal.css";
import { useOrder } from "../contexts/OrdersContext";

export default function CartModal({ isOpen, onClose, productDetails, id }) {
  const { addItem, removeItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityById, setQuantityById] = useState({});
  const [cartId, setCartId] = useState(1);
  const { setOrderId } = useOrder();
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchMainImage = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/images/${id}`
        );
        const data = response.data;
        console.log("Réponse API pour les images :", data);

        if (data && data.first_image) {
          const getImageSrc = (imagePath) =>
            imagePath.startsWith("http://") || imagePath.startsWith("https://")
              ? imagePath
              : `${import.meta.env.VITE_API_URL}${imagePath}`;

          setMainImage(getImageSrc(data.first_image));
        } else {
          console.warn("Aucune image trouvée pour l'ID :", id);
          setMainImage("https://via.placeholder.com/150");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'image :", err);
        setMainImage("https://via.placeholder.com/150");
      }
    };

    fetchMainImage();
  }, [id]);

  const handleConfirm = async () => {
    if (productDetails) {
      addItem({
        id: productDetails.id,
        product_name: productDetails.product_name,
        price: productDetails.price,
        quantity,
        image_url: mainImage,
      });
      console.log("Produit ajouté au panier :", productDetails);

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
    } catch {
      throw new Error(
        "Erreur lors de l'ajout au panier dans la base de données"
      );
    }
  };

  const handleRemove = async (productId) => {
    removeItem(productId);
    setQuantityById((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });

    try {
      await removeFromCart(cartId, productId);
      console.log("Produit supprimé de la base de données.");
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
    }
  };

  const removeFromCart = async (cartId, productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart_product/${cartId}/${productId}`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression dans la base de données :",
        error
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
      const paymentId = paymentResponse.data.id;

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          user_id: 1,
          payment_id: paymentId,
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Votre panier</h2>
        <hr />

        {items.length > 0 ? (
          <div className="center-cart">
            {items.map((item) => {
              const itemQuantity = quantityById[item.id] || item.quantity;
              const subtotal = item.price * itemQuantity;

              return (
                <div key={item.id} className="product-cart-data">
                  <img
                    src={item.image_url || "https://via.placeholder.com/150"}
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
            <h3 className="h3-title">Total : {totalPrice} €</h3>
          </div>
        ) : (
          <p>Votre panier est vide.</p>
        )}

        <button className="add-to-cart-btn" onClick={handleConfirm}>
          Ajouter au panier
        </button>

        {productDetails && (
          <div>
            <h4 className="h4-title">Ajouter un autre produit</h4>
            <div>
              <label>Quantité : </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <button
              className="confirm-order-btn"
              onClick={createOrderAndPayment}
            >
              Confirmer la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
