import { useEffect, useState } from "react";
import api from "../services/api";
import "./Upload.css";

function Upload() {
    const [file, setFile] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [album, setAlbum] = useState("");
    const [metadata, setMetadata] = useState("");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState("")

    // fetch albums
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await api.get("/albums/");
                console.log("ALBUM RESPONSE:", res.data);

                setAlbums(res.data);
            } catch {
                alert("Failed to load albums");
            }
        };

        fetchAlbums();
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("original_img", file);
            formData.append("album", album);
            formData.append("metadata", metadata);

            // 1️⃣ Upload photo
            const res = await api.post("/photos/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const photoId = res.data.photo_id;

            // 2️⃣ ADD TAGS *AFTER* upload
            const tagList = tags
                .split(",")
                .map(t => t.trim())
                .filter(Boolean);

            for (let tag of tagList) {
                await api.post(`/photos/${photoId}/add_tag/`, { tag });
            }

            alert("Upload successful!");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };
    

    return (
        <div className="upload-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <h2>Upload Photo</h2>

                <input type="file" accept="image/*" onChange={handleFileChange} />

                {preview && <img src={preview} className="preview" alt="preview" />}

                <select value={album} onChange={(e) => setAlbum(e.target.value)}>
                    <option value="">Select album</option>
                    {albums.map((a) => (
                        <option key={a.album_id} value={a.album_id}>
                            {a.title}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />



                <input
                    type="text"
                    placeholder="Metadata (optional)"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                />

                <button disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}

export default Upload;
