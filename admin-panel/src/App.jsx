import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import Comments from "./pages/Comments";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Leads from "./pages/Leads";
import BulkUpload from "./pages/BulkUpload";



function App() {
  return (
    // 🌐 BrowserRouter is REQUIRED for routing to work
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* 🏠 Admin Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* 📝 Blogs Management */}
          <Route path="/blogs" element={<Blogs />} />

          {/* 💬 Comment Moderation (NEW) */}
          <Route path="/comments" element={<Comments />} />
          
        </Route>
        
        <Route path="/comments" element={<Comments />} />
        <Route path="/Categories" element={<Categories/>}/>
        <Route path="/products" element={<Products />} />
       <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/bulk-upload" element={<BulkUpload />} />

      



      </Routes>
    </BrowserRouter>
  );
}

export default App;
