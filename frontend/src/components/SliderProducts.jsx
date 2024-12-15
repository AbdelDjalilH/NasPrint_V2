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

        const data = response.data;
        if (data && typeof data === "object") {
          // Fonction pour gérer les chemins locaux et distants
          const getImageSrc = (imagePath) => {
            if (!imagePath) return null;

            // Vérifiez si l'image est un lien distant
            if (
              imagePath.startsWith("http://") ||
              imagePath.startsWith("https://")
            ) {
              return imagePath;
            }

            // Sinon, concaténez avec l'URL de base locale
            return `http://localhost:3335${imagePath}`;
          };

          // Créez un tableau d'images
          const imageUrls = [
            getImageSrc(data.first_image),
            getImageSrc(data.second_image),
            getImageSrc(data.third_image),
            getImageSrc(data.fourth_image), // Correction du nom
            getImageSrc(data.fifth_image), // Correction du nom
          ].filter((url) => url); // Filtre les valeurs nulles ou vides

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

  return (
    <div className="carousel-container-2">
      <Carousel showThumbs={true} autoPlay interval={12000} infiniteLoop>
        {images.map((url, index) => (
          <div key={index}>
            <img
              className="img-balise"
              src={url}
              alt={`Image de produit ${index + 1}`}
              onError={(e) => {
                e.target.src = "/path/to/default-image.jpg"; // Image par défaut
                console.error("Erreur de chargement pour l'image :", url);
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
