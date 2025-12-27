import { useEffect, useState } from "react";
import api from "../services/api";
import "./Upload.css";

function Upload() {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [albums, setAlbums] = useState([]);
    const [album, setAlbum] = useState("");
    // const [metadata, setMetadata] = useState("");
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
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) return alert("Select at least one file");
        if (!album) return alert("Select an album");

        try {
            setLoading(true);

            const formData = new FormData();
            files.forEach(file => formData.append("photos", file));
            formData.append("album", album);

            // 1️⃣ Batch upload
            const res = await api.post("/photos/batch_upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const photoIds = res.data.photo_ids;

            // 2️⃣ Add tags to EACH uploaded photo
            const tagList = tags
                .split(",")
                .map(t => t.trim())
                .filter(Boolean);

            for (let photoId of photoIds) {
                for (let tag of tagList) {
                    await api.post(`/photos/${photoId}/add_tag/`, { tag });
                }
            }

            alert("Batch upload started!");
            setFiles([]);
            setPreviews([]);
            setTags("");

        } catch (err) {
            console.error(err);
            alert("Batch upload failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="upload-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <h2>Upload Photo</h2>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />


                <div className="preview-grid">
                    {previews.map((src, i) => (
                        <img key={i} src={src} className="preview" alt="preview" />
                    ))}
                </div>


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





                <button disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}

export default Upload;
