import { useEffect, useState } from "react";
import api from "../api/axios";
import "../assets/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    products: 0,
    categories: 0,
    leads: 0,
  });

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {
        console.error("Failed to load dashboard stats");
      });
  }, []);

  return (
    <div className="page">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <StatCard title="Blogs" value={stats.blogs} icon="📝" />
        <StatCard title="Products" value={stats.products} icon="📦" />
        <StatCard title="Categories" value={stats.categories} icon="🗂️" />
        <StatCard title="Leads" value={stats.leads} icon="📩" />
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <a href="/blogs" className="qa-btn">➕ Add Blog</a>
        <a href="/products/add" className="qa-btn">➕ Add Product</a>
        <a href="/leads" className="qa-btn">📩 View Leads</a>
        <a href="/categories" className="qa-btn">➕ Categories</a>
      </div>

      {/* SYSTEM INFO */}
      <div className="system-info">
        <h3>System Status</h3>
        <ul>
          <li>✅ Backend connected</li>
          <li>✅ JWT authentication active</li>
          <li>✅ Image uploads working</li>
          <li>✅ Admin panel stable</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, link }) {
  return (
    <a href={link} className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </a>
  );
}



export default Dashboard;
