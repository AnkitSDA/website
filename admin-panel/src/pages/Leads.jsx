import { useEffect, useState } from "react";
import api from "../api/axios";
import "../assets/leads.css";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      alert("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Contact Leads</h2>
        <span className="count">Total: {leads.length}</span>
      </div>

      {loading ? (
        <p className="loading-text">Loading leads...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th width="120">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-text">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone || "—"}</td>
                    <td className="message-preview">
                      {lead.message.length > 50
                        ? lead.message.slice(0, 50) + "..."
                        : lead.message}
                    </td>
                    <td>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn-sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View
                      </button>
                      <button
                        className="btn-sm danger"
                        onClick={() => deleteLead(lead.id)}
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
      )}

      {/* VIEW MODAL */}
      {selectedLead && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Lead Details</h3>

            <div className="modal-row">
              <strong>Name:</strong> {selectedLead.name}
            </div>

            <div className="modal-row">
              <strong>Email:</strong> {selectedLead.email}
            </div>

            <div className="modal-row">
              <strong>Phone:</strong> {selectedLead.phone || "—"}
            </div>

            <div className="modal-row">
              <strong>Message:</strong>
              <p className="modal-message">{selectedLead.message}</p>
            </div>

            <div className="modal-row">
              <strong>Submitted At:</strong>{" "}
              {new Date(selectedLead.created_at).toLocaleString()}
            </div>

            <div className="modal-actions">
              <button
                className="btn danger"
                onClick={() => deleteLead(selectedLead.id)}
              >
                Delete
              </button>
              <button
                className="btn"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;
