import "../styles/connexion.css";
export default function Connexion() {
  return (
    <div>
      <section className="connexion-section">
        <form className="connexion-form" action="">
          <h1 className="connexion-title">Pas inscrit? Inscrivez-vous!</h1>
          <div className="input-container-connexion">
            <input type="text" placeholder="Votre adresse mail" />
            <input type="text" placeholder="Votre mot de passe" />
          </div>
          <div className="button-container">
            <button className="connexion-btn">S'inscrire</button>
          </div>
        </form>
      </section>
    </div>
  );
}
