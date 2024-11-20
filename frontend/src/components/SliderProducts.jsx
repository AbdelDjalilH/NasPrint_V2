import "react-responsive-carousel/lib/styles/carousel.min.css"; // Styles pour react-responsive-carousel
import { Carousel } from "react-responsive-carousel";
import "../styles/sliderProducts.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SliderProducts({ id }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/images/${id}`
        );
        console.log("Données récupérées : ", response.data);

        // Vérifiez si `response.data` est un objet
        const data = response.data;
        if (data && typeof data === "object") {
          // Créez un tableau d'images en filtrant les valeurs non vides
          const imageUrls = [
            data.first_image,
            data.second_image,
            data.third_image,
            data.four_image,
            data.five_image,
          ].filter((url) => url); // Filtre les valeurs vides ou nulles
          setImages(imageUrls);
        } else {
          console.warn(
            "Les données reçues ne sont pas un objet :",
            response.data
          );
          setImages([]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des images :", err);
        setError("Erreur lors de la récupération des images.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImages();
    }
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  // Affichage des images dans le carousel
  return (
    <div className="carousel-container-2">
      <Carousel showThumbs={true} autoPlay interval={12000} infiniteLoop>
        {images.map((url, index) => (
          <div key={index}>
            <img
              className="img-balise"
              src={url}
              alt={`Image de produit ${index + 1}`}
              onError={() =>
                console.error("Erreur de chargement pour l'image :", url)
              }
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
