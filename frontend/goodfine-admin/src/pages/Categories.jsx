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

  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (image) fd.append("image", image);
    if (banner) fd.append("banner_image", banner);

    await api.post("/categories", fd);
    fetchCategories();

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
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Categories</h1>

      {/* FORM CARD */}
      <div className="card">
        <h3 className="card-title">Add / Edit Category</h3>

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

          <div>
            <label className="label">Category Image</label>
            <input type="file" onChange={handleImage} />
            {imagePreview && <img src={imagePreview} className="preview-img" />}
          </div>

          <div>
            <label className="label">Banner Image</label>
            <input type="file" onChange={handleBanner} />
            {bannerPreview && <img src={bannerPreview} className="preview-img" />}
          </div>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="primary-btn">Add Category</button>
        </form>
      </div>

      {/* TABLE CARD */}
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
                  <button className="action-btn edit-btn">Edit</button>
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
