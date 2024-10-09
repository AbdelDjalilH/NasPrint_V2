import "../styles/register.css";
export default function Register() {
  return (
    <div>
      <section className="register-section">
        <form className="register-form" action="">
          <h1 className="register-title">Pas inscrit? Inscrivez-vous!</h1>
          <div className="input-container">
            <input type="text" placeholder="Votre Nom" />
            <input type="text" name="" id="" placeholder="Votre Prénom" />
            <input type="text" placeholder="Votre adresse mail" />
            <input type="text" placeholder="Votre mot de passe" />
          </div>
          <div className="button-container">
            <button className="register-btn">S'inscrire</button>
          </div>
        </form>
      </section>
    </div>
  );
}
