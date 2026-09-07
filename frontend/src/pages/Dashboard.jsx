import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../services/api";
import vectorImg from "../assets/vector.png";

// ── Deterministic simulated data ──────────────────────────────
const getSimulatedData = (stock) => {
  if (!stock?.symbol) return { val: "0.85", isPositive: true, vol: "0", diff: "0.00", sliderPos: 50 };
  const seed = stock.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const isPositive = seed % 2 === 0;
  const val = ((seed % 5) + stock.symbol.length * 0.15 + 0.2).toFixed(2);
  const vol = (seed * 12345).toLocaleString("en-IN");
  const diff = ((seed % 7) * 40.5).toFixed(2);
  const sliderPos = 10 + (seed % 80);
  return { val, isPositive, vol, diff, sliderPos };
};

// ── Inline SVG Sparkline ───────────────────────────────────────
const Sparkline = ({ symbol = "", isPositive }) => {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const pts = Array.from({ length: 9 }, (_, i) => 10 + ((seed * (i + 2) * 7) % 30));
  const max = Math.max(...pts), min = Math.min(...pts);
  const range = max - min || 1;
  const W = 90, H = 36;
  const path = pts
    .map((v, i) => `${(i / (pts.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(" ");
  const color = isPositive ? "#00d09c" : "#f43f5e";
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("price");
  const [sortDir, setSortDir] = useState("desc");

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
    const timer = setTimeout(fetchStocks, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortArrow = ({ k }) => (
    <span style={{ marginLeft: 3, opacity: sortKey === k ? 1 : 0.3, fontSize: 10 }}>
      {sortKey === k && sortDir === "asc" ? "↑" : "↓"}
    </span>
  );

  const sorted = [...stocks].sort((a, b) => {
    let va = a.currentPrice, vb = b.currentPrice;
    if (sortKey === "symbol") { va = a.symbol; vb = b.symbol; }
    if (sortKey === "change") {
      va = parseFloat(getSimulatedData(a).val) * (getSimulatedData(a).isPositive ? 1 : -1);
      vb = parseFloat(getSimulatedData(b).val) * (getSimulatedData(b).isPositive ? 1 : -1);
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  return (
    <>
      {/* ── HERO ─────────────────────────────── */}
      <div className="hero-section">
        {!loading && stocks.length > 0 && (
          <div className="ticker-wrap">
            <div className="ticker-track">
              {[...stocks, ...stocks, ...stocks].map((stock, i) => {
                const d = getSimulatedData(stock);
                return (
                  <div key={`${stock._id}-${i}`} className="ticker-item">
                    <strong style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: 13 }}>
                      {stock.symbol}
                    </strong>
                    <span style={{ color: "var(--text-muted)", fontSize: 13, marginRight: 6 }}>
                      ₹{Number(stock.currentPrice).toLocaleString("en-IN")}
                    </span>
                    <span className={d.isPositive ? "profit" : "loss"}
                      style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 2, fontWeight: 500 }}>
                      {d.isPositive ? "↑" : "↓"} {d.val}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h1 className="hero-title" style={{ marginTop: 20 }}>
          "Turn savings into success"
        </h1>
        <button className="primary-btn pill-btn"
          onClick={() => document.getElementById("search-input")?.focus()}>
          Invest Easy
        </button>
        <div className="hero-image-wrap">
          <img src={vectorImg} alt="Trading visualization" />
        </div>
      </div>

      {/* ── SCREENER TABLE ───────────────────── */}
      {!loading && stocks.length > 0 && (
        <div className="stocks-section" style={{ maxWidth: 1200, paddingTop: 0 }}>
          <div className="section-heading" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2>Intraday Stocks Screener</h2>
            <button onClick={fetchStocks}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          {/* Filter pills */}
          <div className="filters-row" style={{ marginBottom: 20 }}>
            <button className="filter-btn" style={{ padding: "8px 12px" }}>
              <TuneIcon sx={{ fontSize: 17 }} />
            </button>
            <button className="filter-btn">Price change &gt;1% <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /></button>
            <button className="filter-btn">52W Performance <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /></button>
            <button className="filter-btn">RSI <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /></button>
            <button className="filter-btn">MACD <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /></button>
            <button className="filter-clear">Clear all</button>
          </div>

          <div className="stocks-dashboard-table">
            <table className="dt-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("symbol")}>
                    Company <SortArrow k="symbol" />
                  </th>
                  <th style={{ textAlign: "center" }}>Chart</th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("price")}>
                    Market price <SortArrow k="price" />
                  </th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("change")}>
                    1D price change <SortArrow k="change" />
                  </th>
                  <th style={{ textAlign: "right" }}>1D volume ↓</th>
                  <th style={{ textAlign: "right" }}>1W avg vol diff</th>
                  <th style={{ textAlign: "right" }}>52W performance</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((stock) => {
                  const d = getSimulatedData(stock);
                  const changeAmt = ((stock.currentPrice * parseFloat(d.val)) / 100).toFixed(2);
                  return (
                    <tr key={stock._id} style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/stocks/${stock._id}`)}>
                      {/* Company */}
                      <td style={{ textAlign: "left" }}>
                        <div className="dt-company">
                          <div className="dt-logo">{stock.symbol.substring(0, 2)}</div>
                          <div>
                            <div className="dt-name">{stock.companyName}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{stock.symbol}</div>
                          </div>
                        </div>
                      </td>
                      {/* Sparkline */}
                      <td style={{ textAlign: "center" }}>
                        <Sparkline symbol={stock.symbol} isPositive={d.isPositive} />
                      </td>
                      {/* Price */}
                      <td>
                        <div className="dt-price">₹{Number(stock.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      </td>
                      {/* Change */}
                      <td>
                        <div className={`dt-change ${d.isPositive ? "profit" : "loss"}`}>
                          {d.isPositive ? "+" : "-"}₹{changeAmt} ({d.val}%)
                        </div>
                      </td>
                      {/* Volume */}
                      <td>
                        <div className="dt-vol">{d.vol}</div>
                      </td>
                      {/* 1W diff */}
                      <td>
                        <div className={d.isPositive ? "profit" : "loss"} style={{ fontSize: 13, fontWeight: 500 }}>
                          {d.isPositive ? "+" : "-"}{d.diff}%
                        </div>
                      </td>
                      {/* 52W slider */}
                      <td>
                        <div className="dt-slider-wrap">
                          <span>L</span>
                          <div className="dt-slider">
                            <div className="dt-marker" style={{ left: `${d.sliderPos}%` }} />
                          </div>
                          <span>H</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;