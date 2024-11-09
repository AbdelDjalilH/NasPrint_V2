import { useRef } from "react";
import emailjs from "@emailjs/browser";
import "../styles/contactPage.css";
// import styled from "styled-components";

// npm i @emailjs/browser

const ContactPage = () => {
  const form = useRef();

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
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    // <StyledContactForm>
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
    </div>

    // </StyledContactForm>
  );
};

export default ContactPage;

// Styles
// const StyledContactForm = styled.div`
//   width: 400px;

//   form {
//     display: flex;
//     align-items: flex-start;
//     flex-direction: column;
//     width: 100%;
//     font-size: 16px;

//     input {
//       width: 100%;
//       height: 35px;
//       padding: 7px;
//       outline: none;
//       border-radius: 5px;
//       border: 1px solid rgb(220, 220, 220);

//       &:focus {
//         border: 2px solid rgba(0, 206, 158, 1);
//       }
//     }

//     textarea {
//       max-width: 100%;
//       min-width: 100%;
//       width: 100%;
//       max-height: 100px;
//       min-height: 100px;
//       padding: 7px;
//       outline: none;
//       border-radius: 5px;
//       border: 1px solid rgb(220, 220, 220);

//       &:focus {
//         border: 2px solid rgba(0, 206, 158, 1);
//       }
//     }

//     label {
//       margin-top: 1rem;
//     }

//     input[type="submit"] {
//       margin-top: 2rem;
//       cursor: pointer;
//       background: rgb(249, 105, 14);
//       color: white;
//       border: none;
//     }
//   }
// `;
