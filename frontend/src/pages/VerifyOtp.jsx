import "../styles/verifyOtp.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email: state?.email,
          otp,
          password: state?.password,
          username: state?.username,
        }
      );

      if (response.status === 200) {
        console.info("OTP validé avec succès :", response.data);

        await login(state?.email, state?.password);

        navigate("/client-info");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la validation de l'OTP :",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="verify-otp">
      <form className="otp-form" onSubmit={handleSubmit}>
        <h1>Vérifiez votre compte</h1>
        <p>Un code OTP a été envoyé à votre email.</p>
        <input
          className="otp-input"
          type="text"
          placeholder="Entrez le code OTP"
          value={otp}
          onChange={handleChange}
          required
        />
        <button className="otp-btn" type="submit">
          Valider
        </button>
      </form>
    </div>
  );
}
