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
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} id="register-form">
        <div className="auth-logo">
          <img src={logo} alt="AstroDunia" />
        </div>

        <h1>Register</h1>
        <p className="auth-subtitle">
          Create your account and start your investing journey
        </p>

        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
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
          id="register-submit-btn"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;