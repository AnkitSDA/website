import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/products.css";

const BACKEND_URL = "http://localhost:5000";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ FINAL IMAGE NORMALIZER (HANDLES ALL CASES)
  const getImageUrl = (image) => {
    if (!image) return null;

    // Already full URL
    if (image.startsWith("http")) {
      return image;
    }

    // Starts with /uploads/...
    if (image.startsWith("/uploads")) {
      return `${BACKEND_URL}${image}`;
    }

    // Starts with uploads/...
    if (image.startsWith("uploads/")) {
      return `${BACKEND_URL}/${image}`;
    }

    // Plain filename
    return `${BACKEND_URL}/uploads/products/${image}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Products</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/add")}
        >
          + Add Product
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th style={{ width: "90px" }}>Image</th>
              <th>Name</th>
              <th style={{ width: "220px" }}>Category</th>
              <th style={{ width: "100px" }}>Status</th>
              <th style={{ width: "90px" }}>Featured</th>
              <th style={{ width: "140px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const imageUrl = getImageUrl(product.image);

                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    {/* ✅ IMAGE COLUMN – FIXED FOREVER */}
                    <td>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="product-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="no-image">No Image</span>
                      )}
                    </td>

                    <td className="name-cell">{product.name}</td>
                    <td>{product.category_name}</td>

                    <td>
                      <span
                        className={`badge ${
                          product.status === "active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>{product.featured ? "Yes" : "No"}</td>

                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          navigate(`/products/edit/${product.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
