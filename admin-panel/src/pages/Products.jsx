import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/products.css";

const BACKEND_URL = "http://localhost:5000";

function Products() {
  const [products, setProducts] = useState([]);
  const [imagesMap, setImagesMap] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     FETCH PRODUCTS
  ========================== */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);

      // fetch images for each product
      res.data.forEach((p) => fetchImages(p.id));
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    }
  };

  /* =========================
     FETCH PRODUCT IMAGES
  ========================== */
  const fetchImages = async (productId) => {
    try {
      const res = await api.get(`/products/${productId}/images`);
      setImagesMap((prev) => ({
        ...prev,
        [productId]: res.data || [],
      }));
    } catch {
      setImagesMap((prev) => ({ ...prev, [productId]: [] }));
    }
  };

  /* =========================
     DELETE SINGLE
  ========================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      alert("Product deleted successfully");
    } catch {
      alert("Delete failed");
    }
  };

  /* =========================
     BULK DELETE
  ========================== */
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;

    try {
      await api.delete("/products/bulk-delete", {
        data: { ids: selectedIds },
      });

      alert("Products deleted successfully");
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Bulk delete failed");
    }
  };

  /* =========================
     CHECKBOX LOGIC
  ========================== */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? products.map((p) => p.id) : []);
  };

  /* =========================
     IMAGE URL
  ========================== */
  const getImageUrl = (img) =>
    `${BACKEND_URL}/uploads/products/gallery/${img}`;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Products</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          {selectedIds.length > 0 && (
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => navigate("/products/add")}
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th style={{ width: "60px" }}>ID</th>
              <th style={{ width: "140px" }}>Images</th>
              <th>Name</th>
              <th style={{ width: "200px" }}>Category</th>
              <th style={{ width: "90px" }}>Status</th>
              <th style={{ width: "160px" }}>Actions</th>
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
              products.map((product) => (
                <tr key={product.id}>
                  {/* CHECKBOX */}
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>

                  <td>{product.id}</td>

                  {/* MULTI IMAGES */}
                  <td>
                    <div className="image-strip">
                      {imagesMap[product.id]?.length > 0 ? (
                        imagesMap[product.id].map((img) => (
                          <img
                            key={img.id}
                            src={getImageUrl(img.image)}
                            alt=""
                            className="product-thumb"
                          />
                        ))
                      ) : (
                        <span className="no-image">No Image</span>
                      )}
                    </div>
                  </td>

                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>{product.status}</td>

                  {/* ACTIONS */}
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
                      style={{ marginLeft: "6px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
