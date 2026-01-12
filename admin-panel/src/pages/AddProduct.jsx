import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/products.css";

/* =========================
   SLUG GENERATOR
========================= */
const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [status, setStatus] = useState("active");

  /* ==========================
     FETCH CATEGORIES
  ========================== */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    }
  };

  /* ==========================
     NAME CHANGE → AUTO SLUG
  ========================== */
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  /* ==========================
     SUBMIT PRODUCT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryId) {
      alert("Product name and category are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug); // ✅ SLUG SENT
      formData.append("category_id", categoryId);
      if (image) formData.append("image", image);
      formData.append("short_description", shortDesc);
      formData.append("description", description);
      formData.append("model_number", modelNumber);
      formData.append("meta_title", metaTitle);
      formData.append("meta_description", metaDescription);
      formData.append("meta_keywords", keywords);
      formData.append("status", status);

      await api.post("/products", formData);

      alert("Product added successfully");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="page">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Add Product</h2>
        </div>

        {/* BASIC INFO */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            {/* ✅ SLUG FIELD */}
            <div className="form-group">
              <label>Product Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="sanding-sealer"
              />
              <small style={{ color: "#666" }}>
                URL Preview: /products/{slug}
              </small>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="form-group full-width">
              <label>Short Description</label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SEO / META */}
        <div className="form-section">
          <h3>SEO & Metadata</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Model Number</label>
              <input
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Meta Title</label>
              <input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Meta Keywords</label>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
