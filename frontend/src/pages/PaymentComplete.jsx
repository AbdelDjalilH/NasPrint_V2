import "../styles/paymentComplete.css";

export default function PaymentComplete() {
  return (
    <div className="paymentComplete-container">
      <h1 className="confirmation-title">Votre paiement a bien été transmis</h1>
      <p className="confirmation-text">
        Veuillez vérifier la confirmation de commande dans vos emails.
      </p>
    </div>
  );
}
