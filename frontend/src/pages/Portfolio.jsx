import { useEffect, useState } from "react";
import api from "../services/api";

const Money = ({ value }) => (
  <>
    ₹
    {Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}
  </>
);

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/portfolio");

        setPortfolio(res.data);
      } catch (error) {
        setError("Unable to load portfolio");
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
      <div className="loader">
        Loading portfolio...
      </div>
    );
  }

  return (
    <main className="page">
      <h1>My Portfolio</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Available Cash</span>
          <strong>
            <Money value={portfolio.cash} />
          </strong>
        </div>

        <div className="stat-card">
          <span>Invested Amount</span>
          <strong>
            <Money value={portfolio.totalInvested} />
          </strong>
        </div>

        <div className="stat-card">
          <span>Current Value</span>
          <strong>
            <Money
              value={
                portfolio.currentPortfolioValue
              }
            />
          </strong>
        </div>

        <div className="stat-card">
          <span>Total Account Value</span>
          <strong>
            <Money
              value={portfolio.totalAccountValue}
            />
          </strong>
        </div>

        <div className="stat-card">
          <span>Overall P/L</span>

          <strong
            className={
              portfolio.profitLoss >= 0
                ? "profit"
                : "loss"
            }
          >
            <Money value={portfolio.profitLoss} />
          </strong>
        </div>
      </div>

      <section className="card table-container">
        <h2>My Holdings</h2>

        {portfolio.holdings.length === 0 ? (
          <p className="muted">
            You don't own any stocks yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Avg. Price</th>
                <th>Current Price</th>
                <th>Invested</th>
                <th>Current Value</th>
                <th>P/L</th>
              </tr>
            </thead>

            <tbody>
              {portfolio.holdings.map((holding) => (
                <tr key={holding.id}>
                  <td>
                    <strong>
                      {holding.symbol}
                    </strong>

                    <br />

                    <small>
                      {holding.companyName}
                    </small>
                  </td>

                  <td>{holding.quantity}</td>

                  <td>
                    <Money
                      value={
                        holding.averagePurchasePrice
                      }
                    />
                  </td>

                  <td>
                    <Money
                      value={holding.currentPrice}
                    />
                  </td>

                  <td>
                    <Money
                      value={holding.investedAmount}
                    />
                  </td>

                  <td>
                    <Money
                      value={holding.currentValue}
                    />
                  </td>

                  <td
                    className={
                      holding.profitLoss >= 0
                        ? "profit"
                        : "loss"
                    }
                  >
                    <Money
                      value={holding.profitLoss}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default Portfolio;