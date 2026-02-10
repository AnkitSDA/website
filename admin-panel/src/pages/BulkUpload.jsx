import { useState } from "react";
import api from "../api/axios";
import "../assets/BulkUpload.css";

const BulkUpload = () => {
  const [type, setType] = useState("categories");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult(null);

      const res = await api.post(
        `/bulk-upload/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-upload">
      <h2>Bulk Upload</h2>

      <div className="card">
        <label>Upload Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="categories">Categories</option>
          <option value="products">Products</option>
        </select>

        <label>CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {result && (
        <div className="result">
          <h3>Upload Result</h3>
          <p>Inserted: {result.inserted}</p>
          <p>Skipped: {result.skipped}</p>

          {result.errors?.length > 0 && (
            <>
              <h4>Errors</h4>
              <ul>
                {result.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}: {e.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
