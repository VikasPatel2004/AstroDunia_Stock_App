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
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} id="login-form">
        <div className="auth-logo">
          <img src={logo} alt="AstroDunia" />
        </div>

        <h1>Login</h1>
        <p className="auth-subtitle">
          Enter your details to access your account
        </p>

        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="error" role="alert" style={{ marginBottom: '16px', color: 'var(--red)', background: 'var(--red-light)', border: '1px solid var(--red)', padding: '12px', borderRadius: '4px', fontSize: '13px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="primary-btn"
          style={{ width: '100%', marginBottom: '16px' }}
          disabled={loading}
          id="login-submit-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;