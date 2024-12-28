import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/contactPage.css";

const ContactPage = () => {
  const form = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_cbtzkt6",
        "template_7jo5276",
        form.current,
        "RmLCzfuDa2mFptpNf"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
          setIsModalOpen(true);

          setTimeout(() => {
            window.location.reload();
          }, 5000);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="contact-div">
      <form className="contact-form" ref={form} onSubmit={sendEmail}>
        <input
          placeholder="Votre nom"
          className="contact-input"
          type="text"
          name="user_name"
        />
        <input
          placeholder="Votre email"
          className="contact-input"
          type="email"
          name="user_email"
        />
        <textarea
          placeholder="Votre message"
          className="contact-textarea"
          name="message"
        />
        <input className="contact-input" type="submit" value="Envoyer" />
      </form>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <h2>Votre message a bien été envoyé !</h2>
          <p>La page se recharge automatiquement dans 5 secondes.</p>
          <button className="close-button" onClick={closeModal}>
            Fermer
          </button>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ closeModal, children }) => {
  return (
    <div className="modal-overlay-contact" onClick={closeModal}>
      <div
        className="modal-content-contact"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ContactPage;
