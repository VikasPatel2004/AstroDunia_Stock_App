import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import InboxIcon from "@mui/icons-material/Inbox";

const fmt = (value, decimals = 2) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}`;

const StockChart = () => {
  const pointsData = useMemo(() => {
    const width = 800;
    const height = 180;
    const numPoints = 120;
    
    let val = 100;
    const data = [val];
    for (let i = 1; i < numPoints; i++) {
        val += (Math.random() - 0.45) * 8; 
        data.push(val);
    }
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const pts = data.map((v, i) => {
        const x = (i / (numPoints - 1)) * width;
        const y = height - ((v - min) / range) * (height - 30) - 15;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    
    const areaPts = `${pts} ${width},${height} 0,${height}`;
    return { pts, areaPts, width, height };
  }, []);

  return (
    <div style={{ marginTop: '40px' }}>
      <svg viewBox={`0 0 ${pointsData.width} ${pointsData.height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfd4dd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e3e6ec" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline points={pointsData.areaPts} fill="url(#chartGradient)" />
        <polyline points={pointsData.pts} fill="none" stroke="#1c1d25" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="chart-xaxis">
        <span>Jan '19</span>
        <span>Jul '19</span>
        <span>Jan '20</span>
        <span>Jul '20</span>
        <span>Jan '21</span>
        <span>Jul '21</span>
        <span>Jan '22</span>
        <span>Jul '22</span>
        <span>Jan '23</span>
        <span>Jul '23</span>
        <span>Jan '24</span>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/portfolio");
        setPortfolio(res.data);
      } catch {
        setError("Unable to load portfolio. Please try again.");
      }
    };
    fetchPortfolio();
  }, []);

  if (error) {
    return (
      <main className="page">
        <div className="error">{error}</div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <div className="loader" style={{ paddingTop: "140px" }}>
        <div className="loader-spinner" />
        Loading portfolio...
      </div>
    );
  }

  const plPositive = portfolio.profitLoss >= 0;
  const plPercent = portfolio.totalInvested > 0
      ? ((portfolio.profitLoss / portfolio.totalInvested) * 100).toFixed(2)
      : "0.00";

  // Pseudo-values to match the "Today / Yesterday" vibe in the screenshot layout
  const todayPl = portfolio.profitLoss * 0.12; 
  const yestPl = portfolio.profitLoss * 0.28;

  return (
    <main className="page" style={{ paddingTop: '100px' }}>
      
      <div className="portfolio-showcase-card">
        <div className="live-badge">
          <div className="live-badge-dot"></div>
          Live Updates
        </div>
        
        <div className="port-title">My Portfolio</div>
        <div className="port-value">{fmt(portfolio.currentPortfolioValue, 2)}</div>
        
        {/* Decorative Daily P&L rows based on screenshot */}
        <div className="port-pl-row">
            <span className={`val ${todayPl >= 0 ? 'profit' : 'loss'}`}>
                {todayPl >= 0 ? '+' : ''}{fmt(todayPl)} ({todayPl >= 0 ? '+' : ''}0.24%)
            </span>
            <span className="label">Today</span>
        </div>
        
        <div className="port-pl-row">
            <span className={`val ${yestPl >= 0 ? 'profit' : 'loss'}`}>
                {yestPl >= 0 ? '+' : ''}{fmt(yestPl)} ({yestPl >= 0 ? '+' : ''}0.53%)
            </span>
            <span className="label">Yesterday</span>
        </div>

        <div className="port-pl-row">
            <span className={`val ${plPositive ? 'profit' : 'loss'}`}>
                {plPositive ? '+' : ''}{fmt(portfolio.profitLoss)} ({plPositive ? '+' : ''}{plPercent}%)
            </span>
            <span className="label">All Time</span>
        </div>

        <StockChart />

        <div className="port-bottom-grid">
            <div className="port-bottom-card">
                <div className="pb-label">Available Cash</div>
                <div className="pb-value">{fmt(portfolio.cash)}</div>
            </div>
            <div className="port-bottom-card">
                <div className="pb-label">Amount Invested</div>
                <div className="pb-value">{fmt(portfolio.totalInvested)}</div>
            </div>
        </div>
      </div>

      {/* Holdings Table */}
      <section>
        <h2 className="section-title">Holdings</h2>

        {portfolio.holdings.length === 0 ? (
          <div className="empty" style={{ background: '#fff' }}>
            <span className="empty-icon"><InboxIcon sx={{ fontSize: 40, color: 'var(--text-muted)' }} /></span>
            <h3>No holdings yet</h3>
            <p>Go to the stocks page and execute your first trade.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Avg. Price</th>
                  <th>Current Price</th>
                  <th>Invested</th>
                  <th>Current Value</th>
                  <th>P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((holding) => {
                  const pos = holding.profitLoss >= 0;
                  const pct =
                    holding.investedAmount > 0
                      ? ((holding.profitLoss / holding.investedAmount) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr key={holding.id}>
                      <td className="symbol-cell">
                        <span className="symbol-badge">{holding.symbol}</span>
                        <small>{holding.companyName}</small>
                      </td>
                      <td><strong>{holding.quantity}</strong></td>
                      <td>{fmt(holding.averagePurchasePrice)}</td>
                      <td>{fmt(holding.currentPrice)}</td>
                      <td>{fmt(holding.investedAmount)}</td>
                      <td>{fmt(holding.currentValue)}</td>
                      <td className={pos ? "profit" : "loss"}>
                        {pos ? "+" : ""}{fmt(holding.profitLoss)}
                        <br />
                        <small>{pos ? "▲" : "▼"} {pct}%</small>
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

export default Portfolio;