import { useEffect, useState } from "react";
import api from "../services/api";

function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get("/photos/");
        setPhotos(res.data);
      } catch (err) {
        alert("Failed to load photos");
        console.error(err);
      }
    };

    fetchPhotos();
  }, []);

return (
  <div className="gallery-container">
    {photos.map((photo) => (
      <img
        key={photo.photo_id}
        src={photo.thumbnail_img}
        alt="event"
        className="gallery-img"
      />
    ))}
  </div>
);

}

export default Gallery;
