import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const StockDetails = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();

  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [trading, setTrading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await api.get(`/stocks/${id}`);
        setStock(res.data.stock);
      } catch {
        setError("Stock not found");
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [id]);

  const handleTrade = async (type) => {
    setError("");
    setSuccess("");
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Quantity must be a positive whole number");
      return;
    }

    try {
      setTrading(true);
      const res = await api.post(`/trade/${type}`, {
        stockId: id,
        quantity: qty,
      });
      setSuccess(res.data.message);
      setUser({ ...user, balance: res.data.balance });
      setQuantity("");
    } catch (err) {
      setError(err.response?.data?.message || "Trade failed");
    } finally {
      setTrading(false);
    }
  };

  if (loading) return <div className="loader" style={{ paddingTop: "140px" }}>Loading stock details...</div>;

  if (!stock) {
    return (
      <div className="page">
        <div className="error">{error || "Stock not found"}</div>
      </div>
    );
  }

  const qty = Number(quantity) || 0;
  const estimated = stock.currentPrice * qty;

  return (
    <div
      className="hero-section"
      style={{ minHeight: "100vh" }}
    >
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="page">
          <Link to="/" className="page-back">← Back to Stocks</Link>

          <div className="trade-layout">
            {/* Left: Stock Info */}
            <div className="card trade-info-card">
              <div className="trade-symbol">{stock.symbol}</div>
              <h1 className="trade-company">{stock.companyName}</h1>
              <div className="trade-cmp-label">Current Market Price</div>

              <div className="big-price">
                <span className="price-prefix">₹</span>
                {Number(stock.currentPrice).toLocaleString("en-IN")}
              </div>

              <div className="available-cash">
                💰 Available: ₹{Number(user.balance).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>

              {/* Mini info */}
              <div style={{ marginTop: 28, padding: "16px", background: "rgba(124,58,237,0.08)", borderRadius: 10, border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Execution Rule:</strong><br />
                  Prices are determined by the backend. The frontend only sends quantity — ensuring fair execution.
                </p>
              </div>
            </div>

            {/* Right: Trade Box */}
            <div className="card trade-box-card">
              <h2>Place Order</h2>

              <label>Quantity (shares)</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <div className="estimate-block">
                <span className="est-label">Estimated Total</span>
                <span className="est-value">
                  ₹{estimated.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="trade-buttons">
                <button
                  className="buy-btn"
                  disabled={trading}
                  onClick={() => handleTrade("buy")}
                >
                  {trading ? "Processing..." : "🟢 Buy"}
                </button>

                <button
                  className="sell-btn"
                  disabled={trading}
                  onClick={() => handleTrade("sell")}
                >
                  {trading ? "Processing..." : "🔴 Sell"}
                </button>
              </div>

              {success && <div className="success">{success}</div>}
              {error    && <div className="error">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;