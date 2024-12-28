import "../styles/aPropos.css";
import formation from "../data/formation";
import dessinInd from "../assets/aboutImg/dessinInd.png";

export default function APropos() {
  return (
    <div className="container-Apropos">
      <h1>A propos</h1>
      <section className="introduction-container">
        <p className="text-introduction">
          Dessinateur projeteur de formation, je suis passionné par la
          modélisation et l'impression en 3D. Ayant travaillé pendant plusieurs
          années en tant que dessinateur projeteur au sein de différentes
          industries (produits cosmetiques de luxe, assainissement non
          collectif...) dans lesquelles j'ai acquis une solide expérience dans
          la conception de pièces mécaniques et de produits manufacturés.
          <br />
          Je suis passionné par l'impression 3D car elle permet de transformer
          les idées en réalité. J'aime aider les gens à réaliser leurs projets,
          tout en leur proposant des designs originaux et fonctionnels.
        </p>
        <img
          className="dessinIndImg"
          src={dessinInd}
          alt="dessin Industriel img"
        />
      </section>
      <section className="formation-container">
        <h2 className="formation-title">Formation</h2>
        <ul className="formation-div">
          {formation.map((formationItem, id) => {
            return (
              <li className="lignes-formation" key={id}>
                <div className="itemdetails">
                  <h3>{`${formationItem.date}`}</h3>
                  <p>{formationItem.diplôme}</p>
                  <p>{formationItem.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="experience-container">
        <h2 className="experience-title">Mes réalisations professionnelles</h2>
        <p>
          Réaliser et optimiser la conception d’équipement et d’installation
          industrielle Etablir un cahier des charges et réaliser les ébauches,
          schémas d’installations Déterminer et mesurer les contraintes
          fonctionnelles, dimensionnelles Vérifier la faisabilité et la
          conformité technique d’une installation Participer à la réalisation
          d’essais industriels et proposer des améliorations Contrôler les
          réalisations et assister les services de production.
        </p>
        <p>
          Implantation d’une nouvelle ligne de production Vérifier le process de
          fabrication prévu par les équipes projet Proposer des hypothèses
          d'implantation en prenant en compte les surfaces Optimiser la
          répartition des surfaces entre les zones de production Assurer sur le
          terrain de la cohérence de l'implantation.
        </p>
        <p>
          Conception des moyens de test pour des produits cosmétiques Concevoir
          des moyens d’essais en phase de prototypage Rédiger les spécifications
          technique à partir des besoins du client Rechercher des solutions
          innovantes prenant en considération les contraintes; mécanique
          (dimensionnelle, encombrement, ...) d’automatisme (choix des
          actionneurs) et de fabrication (choix du matériaux adéquate) Rédiger
          des documents technique: plans 2D, 3D, dossier de montage,
          nomenclature, rapport de simulation, … Présenter au service Recherche
          Appliquée la conception du banc d’essai.
        </p>
      </section>
    </div>
  );
}
