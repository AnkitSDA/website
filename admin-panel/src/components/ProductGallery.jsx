import { useEffect, useState } from "react";
// import api from "../api/axios";

const BACKEND_URL = "http://localhost:5000";

function ProductGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  // ✅ ASYNC FUNCTION
  const fetchImages = async () => {
    try {
      const res = await api.get(
        `/product-images/${productId}/images`
      );
      setImages(res.data || []);
    } catch (err) {
      console.error("Fetch gallery error", err);
      setImages([]);
    }
  };

  images.map((img) => {
  console.log("IMG OBJECT =>", img);

  return (
    <div className="gallery-card" key={img.id}>
<img
  src={`http://localhost:5000/uploads/products/${img.image}`}
  alt="gallery"
  style={{
    width: "120px",
    height: "120px",
    objectFit: "cover",
    border: "2px solid green"
  }}
/>

    </div>
  );
})


  // ✅ CALL FUNCTION INSIDE useEffect
  useEffect(() => {
    if (productId) {
      fetchImages();
    }
  }, [productId]);

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) =>
      formData.append("images", file)
    );

    try {
      await api.post(
        `/product-images/${productId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFiles([]);
      fetchImages();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    await api.delete(`/product-images/images/${id}`);
    fetchImages();
  };

  

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={handleUpload}>Upload</button>

      <div>
        {images.map((img) => (
          <img
  src={`${BACKEND_URL}/uploads/products/${img.image}`}
  alt="gallery"
  style={{
    width: "120px",
    height: "120px",
    border: "2px solid red",
    display: "block"
  }}
/>

        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
