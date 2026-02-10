import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#111827",
          color: "#ffffff",
          padding: "30px 20px",
        }}
      >
        <h2
          style={{
            marginBottom: "45px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Goodfine Admin
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Link to="/" style={linkStyle}>
            Dashboard
          </Link>

          <Link to="/blogs" style={linkStyle}>
            Blogs
          </Link>
          
          <Link to="/comments" style={linkStyle}>
          Comments
          </Link>
          <Link to="/categories" style={linkStyle}>Categories</Link>
          <Link to="/products" style={linkStyle}>Products</Link>
          <Link to="/leads" style={linkStyle}>Leadsform</Link>
          <Link to="/bulk-upload" style={linkStyle}>CSV File Upload</Link>
          <Link to="/whatsapp-marketing" style={linkStyle}>WhatsApp Marketing</Link>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "45px",
              padding: "12px",
              fontSize: "15px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#ffffff",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = {
  color: "#d1d5db",
  textDecoration: "none",
  fontSize: "16px",
};

export default AdminLayout;
