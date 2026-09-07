import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <img src={logo} alt="AstroDunia" />
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Get ₹1,00,000 virtual cash to start trading
        </p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;