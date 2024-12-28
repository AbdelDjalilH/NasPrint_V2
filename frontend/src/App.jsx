import { Outlet } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal"; // Importer CartModal

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null); // État pour stocker les détails du produit

  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openCartModalWithProduct = (product) => {
    setProductDetails(product); // Stocke les détails du produit
    setIsCartOpen(true); // Ouvre la modal
  };

  return (
    <div className="App-container">
      <Navbar toggleCartModal={toggleCartModal} />
      <Outlet context={{ openCartModalWithProduct }} />{" "}
      {/* Passez la fonction */}
      <Footer />
      <CartModal
        isOpen={isCartOpen}
        onClose={toggleCartModal}
        productDetails={productDetails}
      />{" "}
      {/* Passez les détails du produit */}
    </div>
  );
}

export default App;
