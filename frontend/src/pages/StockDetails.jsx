import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
        setError("Stock not found.");
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
      setError("Quantity must be a positive whole number.");
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
      setError(err.response?.data?.message || "Trade failed.");
    } finally {
      setTrading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader" style={{ paddingTop: "140px" }}>
        <div className="loader-spinner" />
        Loading stock details...
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="page">
        <div className="error">{error || "Stock not found."}</div>
      </div>
    );
  }

  const qty = Number(quantity) || 0;
  const estimated = stock.currentPrice * qty;
  const canAfford = estimated <= (user?.balance || 0);

  return (
    <div className="page">
      <Link to="/" className="page-back" id="back-to-stocks" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 500, fontSize: '14px' }}>
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Stocks
      </Link>

      <div className="trade-layout">
        {/* Left: Stock Info */}
        <div className="card trade-info-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div className="dt-logo" style={{ width: '56px', height: '56px', fontSize: '18px', borderRadius: '12px' }}>
                {stock.symbol.substring(0, 2)}
              </div>
              <div>
                <h1 className="trade-company" style={{ marginBottom: '4px', fontSize: '28px' }}>{stock.companyName}</h1>
                <div className="trade-symbol" style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{stock.symbol} &bull; NSE</div>
              </div>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
              <div className="trade-cmp-label" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Market Price</div>
              <div className="big-price" style={{ margin: 0, display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="price-prefix" style={{ fontSize: '28px', color: 'var(--text-muted)' }}>₹</span>
                  <span style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>{Number(stock.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="profit" style={{ fontSize: '16px', fontWeight: 600, paddingBottom: '6px' }}>
                  +₹{((stock.currentPrice * 1.5) / 100).toFixed(2)} (+1.50%)
                </div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                <span className="live-badge-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', marginRight: '8px' }}></span>
                Market is Open
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Available Balance</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-darker)' }}>
                    ₹{Number(user.balance).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
              </div>
              <div style={{ flex: 1.5, padding: '20px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', color: '#4338ca', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <InfoOutlinedIcon sx={{ fontSize: 20, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Policy</div>
                    <div style={{ fontSize: '13px', lineHeight: 1.5, opacity: 0.9 }}>
                      Trade prices are fetched and locked server-side at the time of execution.
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Trade Box */}
        <div className="card trade-box-card" style={{ padding: '0', overflow: 'hidden', alignSelf: 'start' }}>
          
          <div style={{ padding: '24px 32px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-darker)' }}>Place Order</h2>
          </div>
          
          <div style={{ padding: '32px' }}>
            <label htmlFor="trade-quantity" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Quantity (shares)</label>
            <input
              id="trade-quantity"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 500,
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                  transition: 'var(--transition)',
                  marginBottom: '24px'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />

            <div className="estimate-block" style={{ padding: '24px 0', borderTop: '1px solid #f1f2f6', borderBottom: '1px solid #f1f2f6', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="est-label" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Estimated Total</span>
              <span
                className="est-value"
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: qty > 0 && !canAfford ? "var(--red)" : "var(--text-darker)",
                  letterSpacing: '-0.02em'
                }}
              >
                ₹{estimated.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            {qty > 0 && !canAfford && (
              <div className="error" style={{ margin: '0 0 20px 0', padding: '12px 16px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
                Insufficient balance for this purchase.
              </div>
            )}

            <div className="trade-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                id="buy-btn"
                className="buy-btn"
                disabled={trading}
                onClick={() => handleTrade("buy")}
                style={{
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 208, 156, 0.2)'
                }}
              >
                {trading ? "Processing..." : "Buy"}
              </button>

              <button
                id="sell-btn"
                className="sell-btn"
                disabled={trading}
                onClick={() => handleTrade("sell")}
                style={{
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'var(--red)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(235, 91, 60, 0.2)'
                }}
              >
                {trading ? "Processing..." : "Sell"}
              </button>
            </div>

            {success && <div className="success" style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--green-light)', color: 'var(--green)', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>{success}</div>}
            {error && <div className="error" style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;