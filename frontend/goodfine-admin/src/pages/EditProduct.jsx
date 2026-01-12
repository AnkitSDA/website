import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../assets/products.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
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
     FETCH PRODUCT + CATEGORIES
  ========================== */
  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data;

      setName(p.name || "");
      setCategoryId(p.category_id || "");
      setShortDesc(p.short_description || "");
      setDescription(p.description || "");
      setModelNumber(p.model_number || "");
      setMetaTitle(p.meta_title || "");
      setMetaDescription(p.meta_description || "");
      setKeywords(p.meta_keywords || "");
      setStatus(p.status || "active");
    } catch (err) {
      alert("Failed to load product");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      setCategories([]);
    }
  };

  /* ==========================
     UPDATE PRODUCT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category_id", categoryId);
      if (image) formData.append("image", image);
      formData.append("short_description", shortDesc);
      formData.append("description", description);
      formData.append("model_number", modelNumber);
      formData.append("meta_title", metaTitle);
      formData.append("meta_description", metaDescription);
      formData.append("meta_keywords", keywords);
      formData.append("status", status);

      await api.put(`/products/${id}`, formData);

      alert("Product updated successfully");
      navigate("/products");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="page">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Edit Product</h2>
        </div>

        {/* BASIC INFO */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
              <label>Change Image</label>
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

        {/* SEO */}
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

        {/* ACTIONS */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Update Product
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
