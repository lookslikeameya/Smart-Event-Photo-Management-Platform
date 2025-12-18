import { useEffect, useState } from "react";
import api from "../services/api";
import "./Gallery.css";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const res = await api.get("/photos/");
      setPhotos(res.data);
    } catch {
      alert("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ADD TAG ON ENTER
  const handleTagKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    if (!tagInput.trim()) return;

    const tags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    for (let name of tags) {
      await api.post(
        `/photos/${selectedPhoto.photo_id}/add_tag/`,
        { tag: name }
      );
    }

    const res = await api.get(`/photos/${selectedPhoto.photo_id}/`);
    setSelectedPhoto(res.data);
    setTagInput("");
    fetchPhotos();
  };

  const removeTag = async (name) => {
    await api.post(
      `/photos/${selectedPhoto.photo_id}/remove_tag/`,
      { tag: name }
    );

    const res = await api.get(`/photos/${selectedPhoto.photo_id}/`);
    setSelectedPhoto(res.data);
    fetchPhotos();
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="gallery-container">

      {/* GRID */}
      <div className="gallery-grid">
        {photos.map(photo => (
          <div
            key={photo.photo_id}
            className="gallery-card"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.thumbnail_img || photo.original_img}
              className="gallery-img"
              alt=""
            />
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedPhoto && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.watermark_img || selectedPhoto.original_img}
              className="modal-image"
              alt=""
            />

            {/* TAGS */}
            <div className="tags">
              {selectedPhoto.tags?.map(tag => (
                <span key={tag.id} className="tag">
                  {tag.name}
                  <button onClick={() => removeTag(tag.name)}>×</button>
                </span>
              ))}
            </div>

            {/* INPUT (ENTER ONLY) */}
            <input
              className="tag-input"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
