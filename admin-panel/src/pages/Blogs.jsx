import { useEffect, useState } from "react";
import api from "../api/axios";
import "../assets/blog.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    image: null,
  });

  /* ================= FETCH BLOGS (LIST) ================= */
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch blogs error", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // ✅ send all fields (important for update safety)
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("metaTitle", formData.metaTitle);
    data.append("metaDescription", formData.metaDescription);
    data.append("keywords", formData.keywords);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, data);
        alert("✅ Blog updated successfully");
      } else {
        await api.post("/blogs", data);
        alert("✅ Blog created successfully");
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  /* ================= EDIT (FIXED) ================= */
  const handleEdit = async (blogId) => {
    try {
      const res = await api.get(`/blogs/${blogId}`); // 🔥 FULL DATA
      const blog = res.data;

      setEditingId(blog.id);
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        description: blog.content || "",
        metaTitle: blog.meta_title || "",
        metaDescription: blog.meta_description || "",
        keywords: blog.keywords || "",
        image: null, // image optional
      });
    } catch (err) {
      console.error("Edit fetch error", err);
      alert("Failed to load blog data");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      image: null,
    });
  };

  /* ================= JSX ================= */
  return (
    <div className="blog-page">
      <h2 className="blog-title">Blogs Management</h2>

      <div className="card">
        <form className="blog-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            name="metaTitle"
            placeholder="Meta Title (SEO)"
            value={formData.metaTitle}
            onChange={handleChange}
          />

          <textarea
            name="metaDescription"
            placeholder="Meta Description (SEO)"
            value={formData.metaDescription}
            onChange={handleChange}
          />

          <input
            name="keywords"
            placeholder="Keywords"
            value={formData.keywords}
            onChange={handleChange}
          />

          <input type="file" name="image" onChange={handleChange} />

          <div className="form-actions">
            <button className="btn btn-primary">
              {editingId ? "Update Blog" : "Create Blog"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <table className="blog-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog.id}>
                  <td>{index + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.slug}</td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(blog.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Blogs;
