import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import AuthForm from "./components/AuthForm";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<AuthForm />} />
        {/* Protected route for user */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute element={<Cart />} /> // Only allowed if accessToken exists
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
