import { useEffect, useState } from "react";
import api from "../api/axios";
import "../assets/comments.css";

export default function Comments() {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await api.get("/comments");
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    await api.delete(`/comments/${id}`);
    fetchComments();
  };

  const toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "approved" ? "pending" : "approved";

  // ✅ Optimistic UI update
  setComments((prev) =>
    prev.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    )
  );

  try {
    await api.put(`/comments/${id}/status`, { status: newStatus });
  } catch (err) {
    alert("Status update failed");
    fetchComments(); // rollback if API fails
  }
};

  return (
    <div className="page-container">
      <h1 className="page-title">Blog Comments</h1>

      <div className="card">
        <h3 className="card-title">All Comments</h3>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Blog</th>
              <th>Name</th>
              <th>Email</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.blog_title}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td className="comment-text">{c.comment}</td>

                {/* STATUS COLUMN */}
                <td>
                  <span className={`badge ${c.status}`}>
                    {c.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td>
                  <button
                    className={`action-btn ${
                      c.status === "approved"
                        ? "reject-btn"
                        : "approve-btn"
                    }`}
                    onClick={() => toggleStatus(c.id, c.status)}
                  >
                    {c.status === "approved" ? "Reject" : "Approve"}
                  </button>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteComment(c.id)}
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
