import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your trading account</p>

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
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;