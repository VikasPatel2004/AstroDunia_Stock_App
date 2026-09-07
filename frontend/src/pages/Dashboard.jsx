import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import heroImg from "../assets/hero.png";

const Dashboard = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/stocks", { params: { search } });
      setStocks(res.data.stocks);
    } catch {
      setError("Unable to load stocks. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchStocks(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="hero-section">
      {/* Background Image Overlay */}
      <div className="hero-bg" />

      <div className="hero-content">
        {/* ── Hero Banner ── */}
        <div className="dashboard-hero">
          <div className="dashboard-hero-text">
            <div className="hero-label">📈 Live Demo Trading</div>

            <h1 className="hero-title">
              TRADE
              <span>SMARTER.</span>
            </h1>

            <p className="hero-sub">
              Welcome back, <strong style={{ color: "#fff" }}>{user?.name}</strong>!
              Your ₹{Number(user?.balance ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} of virtual cash is ready to invest.
            </p>
          </div>

          <div className="hero-image-wrap">
            <img src={heroImg} alt="Trading Visual" />
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search stock by company or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Stock Grid ── */}
        <div className="stocks-section">
          <div className="section-heading">
            {search ? `Results for "${search}"` : "All Stocks"}
          </div>

          {error && <div className="error">{error}</div>}

          {loading ? (
            <div className="loader">Loading stocks...</div>
          ) : stocks.length === 0 ? (
            <div className="empty">No stocks found matching your search.</div>
          ) : (
            <div className="stock-grid">
              {stocks.map((stock) => (
                <Link
                  key={stock._id}
                  to={`/stocks/${stock._id}`}
                  className="stock-card"
                >
                  <div className="stock-card-left">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <h3>{stock.companyName}</h3>
                  </div>
                  <div className="stock-price">
                    <span className="stock-price-prefix">₹</span>
                    {Number(stock.currentPrice).toLocaleString("en-IN")}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;