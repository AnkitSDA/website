import { useEffect, useState } from "react";
import api from "../api/axios";
import "../assets/categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    status: "active",
  });

  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // ✅ REMOVE FLAGS
  const [removeImage, setRemoveImage] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);

  /* ========================
     FETCH CATEGORIES
  ======================== */
  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ========================
     FORM HANDLERS
  ======================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
    setRemoveBanner(false);
  };

  /* ========================
     SUBMIT (ADD / UPDATE)
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    if (image) fd.append("image", image);
    if (banner) fd.append("banner_image", banner);

    // ✅ send remove flags
    if (removeImage) fd.append("remove_image", "1");
    if (removeBanner) fd.append("remove_banner", "1");

    if (editingId) {
      await api.put(`/categories/${editingId}`, fd);
    } else {
      await api.post("/categories", fd);
    }

    resetForm();
    fetchCategories();
  };

  /* ========================
     EDIT CATEGORY
  ======================== */
  const editCategory = (cat) => {
    setEditingId(cat.id);

    setForm({
      name: cat.name,
      meta_title: cat.meta_title || "",
      meta_description: cat.meta_description || "",
      keywords: cat.keywords || "",
      status: cat.status,
    });

    setImage(null);
    setBanner(null);
    setRemoveImage(false);
    setRemoveBanner(false);

    setImagePreview(
      cat.image
        ? `http://localhost:5000/uploads/categories/${cat.image}`
        : null
    );

    setBannerPreview(
      cat.banner_image
        ? `http://localhost:5000/uploads/categories/${cat.banner_image}`
        : null
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ========================
     DELETE CATEGORY
  ======================== */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  /* ========================
     RESET FORM
  ======================== */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      meta_title: "",
      meta_description: "",
      keywords: "",
      status: "active",
    });
    setImage(null);
    setBanner(null);
    setImagePreview(null);
    setBannerPreview(null);
    setRemoveImage(false);
    setRemoveBanner(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Categories</h1>

      {/* ================= FORM CARD ================= */}
      <div className="card">
        <h3 className="card-title">
          {editingId ? "Edit Category" : "Add Category"}
        </h3>

        <form className="category-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="meta_title"
            placeholder="Meta Title"
            value={form.meta_title}
            onChange={handleChange}
          />

          <textarea
            name="meta_description"
            placeholder="Meta Description"
            value={form.meta_description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="keywords"
            placeholder="Keywords (comma separated, max 5)"
            value={form.keywords}
            onChange={handleChange}
          />

          {/* CATEGORY IMAGE */}
          <div>
            <label className="label">Category Image</label>
            <input type="file" onChange={handleImage} />

            {imagePreview && (
              <div className="preview-wrapper">
                <img src={imagePreview} className="preview-img" />
                {editingId && (
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                      setRemoveImage(true);
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>
            )}
          </div>

          {/* BANNER IMAGE */}
          <div>
            <label className="label">Banner Image</label>
            <input type="file" onChange={handleBanner} />

            {bannerPreview && (
              <div className="preview-wrapper">
                <img src={bannerPreview} className="preview-img" />
                {editingId && (
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => {
                      setBanner(null);
                      setBannerPreview(null);
                      setRemoveBanner(true);
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>
            )}
          </div>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="form-actions">
            <button className="primary-btn">
              {editingId ? "Update Category" : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="card">
        <h3 className="card-title">All Categories</h3>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Banner</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id}>
                <td>{i + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>

                <td>
                  {cat.image && (
                    <img
                      src={`http://localhost:5000/uploads/categories/${cat.image}`}
                      className="table-img"
                    />
                  )}
                </td>

                <td>
                  {cat.banner_image && (
                    <img
                      src={`http://localhost:5000/uploads/categories/${cat.banner_image}`}
                      className="table-img"
                    />
                  )}
                </td>

                <td>
                  <span className={`badge ${cat.status}`}>
                    {cat.status}
                  </span>
                </td>

                <td>{new Date(cat.created_at).toLocaleDateString()}</td>

                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => editCategory(cat)}
                  >
                    Edit
                  </button>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
