import { useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import api from "../services/api";

const fmt = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// Simulated mini-chart bars per transaction (deterministic based on _id)
const getMiniSparkline = (id = "") => {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: 8 }, (_, i) => 20 + ((seed * (i + 3)) % 40));
};

const Sparkline = ({ id, isPositive }) => {
  const bars = getMiniSparkline(id);
  const color = isPositive ? "#00d09c" : "#f43f5e";
  const max = Math.max(...bars);
  const min = Math.min(...bars);
  const range = max - min || 1;
  const H = 32, W = 80;
  const pts = bars
    .map((v, i) => `${(i / (bars.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data.transactions);
      } catch {
        setError("Unable to load transaction history.");
      }
    };
    fetchTransactions();
  }, []);

  if (error) return <main className="page"><div className="tx-error">{error}</div></main>;

  if (!transactions)
    return (
      <div style={{ paddingTop: 140, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
        Loading transactions…
      </div>
    );

  const buys = transactions.filter((t) => t.type.toLowerCase() === "buy");
  const sells = transactions.filter((t) => t.type.toLowerCase() === "sell");
  const totalBuyAmt = buys.reduce((a, t) => a + t.totalAmount, 0);
  const totalSellAmt = sells.reduce((a, t) => a + t.totalAmount, 0);

  let filtered =
    filter === "all"
      ? [...transactions]
      : transactions.filter((t) => t.type.toLowerCase() === filter);

  // Sort
  filtered.sort((a, b) => {
    let va, vb;
    if (sortKey === "date") { va = new Date(a.createdAt); vb = new Date(b.createdAt); }
    else if (sortKey === "total") { va = a.totalAmount; vb = b.totalAmount; }
    else if (sortKey === "price") { va = a.executionPrice; vb = b.executionPrice; }
    else if (sortKey === "qty") { va = a.quantity; vb = b.quantity; }
    else { va = 0; vb = 0; }
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === k ? 1 : 0.35, fontSize: 10 }}>
      {sortKey === k && sortDir === "asc" ? "↑" : "↓"}
    </span>
  );

  return (
    <main className="page" style={{ maxWidth: 1200 }}>

      {/* ── Summary stat cards ── */}
      <div className="tx-stat-row">
        <div className="tx-stat-card">
          <div className="tx-stat-icon" style={{ background: "#fff0f2", color: "var(--primary)" }}>
            <ShowChartIcon sx={{ fontSize: 20 }} />
          </div>
          <div>
            <div className="tx-stat-label">Total Trades</div>
            <div className="tx-stat-val">{transactions.length}</div>
          </div>
        </div>
        <div className="tx-stat-card">
          <div className="tx-stat-icon" style={{ background: "#e6fcf5", color: "#00d09c" }}>
            <TrendingUpIcon sx={{ fontSize: 20 }} />
          </div>
          <div>
            <div className="tx-stat-label">Buy Volume</div>
            <div className="tx-stat-val profit">{fmt(totalBuyAmt)}</div>
          </div>
        </div>
        <div className="tx-stat-card">
          <div className="tx-stat-icon" style={{ background: "#fdefee", color: "var(--red)" }}>
            <TrendingDownIcon sx={{ fontSize: 20 }} />
          </div>
          <div>
            <div className="tx-stat-label">Sell Volume</div>
            <div className="tx-stat-val loss">{fmt(totalSellAmt)}</div>
          </div>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="filters-row" style={{ marginBottom: 20 }}>
        <button className="filter-btn" style={{ padding: "8px 12px" }}>
          <TuneIcon sx={{ fontSize: 17 }} />
        </button>
        {["all", "buy", "sell"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "filter-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Orders" : f === "buy" ? "Buy Orders" : "Sell Orders"}
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </button>
        ))}
        <button className="filter-btn">Date range <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /></button>
        <button className="filter-clear" onClick={() => { setFilter("all"); setSortKey("date"); setSortDir("desc"); }}>
          Clear all
        </button>
      </div>

      {/* ── Table ── */}
      <section aria-label="Transaction records">
        {transactions.length === 0 ? (
          <div className="tx-empty">
            <ShowChartIcon sx={{ fontSize: 40, color: 'var(--text-muted)', strokeWidth: 1 }} />
            <h3>No transactions yet</h3>
            <p>Your buy and sell orders will appear here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="tx-empty">
            <ShowChartIcon sx={{ fontSize: 40, color: 'var(--text-muted)' }} />
            <h3>No {filter} orders</h3>
            <p>Choose a different filter to see records.</p>
          </div>
        ) : (
          <div className="stocks-dashboard-table">
            <table className="dt-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Company</th>
                  <th style={{ textAlign: "center" }}>Trend</th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("price")}>
                    Exec. Price <SortIcon k="price" />
                  </th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("qty")}>
                    Qty <SortIcon k="qty" />
                  </th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("total")}>
                    Total Amount <SortIcon k="total" />
                  </th>
                  <th style={{ textAlign: "center" }}>Order Type</th>
                  <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("date")}>
                    Date <SortIcon k="date" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isBuy = t.type.toLowerCase() === "buy";
                  return (
                    <tr key={t._id}>
                      {/* Company */}
                      <td style={{ textAlign: "left" }}>
                        <div className="dt-company">
                          <div className="dt-logo">{t.stockId.symbol.substring(0, 2)}</div>
                          <div>
                            <div className="dt-name">{t.stockId.companyName}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                              {t.stockId.symbol}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sparkline */}
                      <td style={{ textAlign: "center" }}>
                        <Sparkline id={t._id} isPositive={isBuy} />
                      </td>

                      {/* Price */}
                      <td>
                        <div className="dt-price">{fmt(t.executionPrice)}</div>
                      </td>

                      {/* Qty */}
                      <td>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{t.quantity}</span>
                      </td>

                      {/* Total */}
                      <td>
                        <div
                          className="dt-price"
                          style={{ color: isBuy ? "var(--green)" : "var(--red)", fontWeight: 600 }}
                        >
                          {isBuy ? "+" : "-"}{fmt(t.totalAmount)}
                        </div>
                      </td>

                      {/* Badge */}
                      <td style={{ textAlign: "center" }}>
                        <span className={`badge ${t.type.toLowerCase()}`}>{t.type}</span>
                      </td>

                      {/* Date */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, color: "var(--text-dark)", fontWeight: 500 }}>
                          {fmtDate(t.createdAt)}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {fmtTime(t.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Transactions;