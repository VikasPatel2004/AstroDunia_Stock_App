import { useEffect, useState } from "react";
import api from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");

        setTransactions(res.data.transactions);
      } catch (error) {
        setError(
          "Unable to load transaction history"
        );
      }
    };

    fetchTransactions();
  }, []);

  if (error) {
    return (
      <main className="page">
        <div className="error">{error}</div>
      </main>
    );
  }

  if (!transactions) {
    return (
      <div className="loader">
        Loading transactions...
      </div>
    );
  }

  return (
    <main className="page">
      <h1>Transaction History</h1>

      <section className="card table-container">
        {transactions.length === 0 ? (
          <p className="muted">
            No transactions yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Execution Price</th>
                <th>Total Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    <strong>
                      {transaction.stockId.symbol}
                    </strong>

                    <br />

                    <small>
                      {
                        transaction.stockId
                          .companyName
                      }
                    </small>
                  </td>

                  <td>
                    <span
                      className={`badge ${transaction.type.toLowerCase()}`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td>
                    {transaction.quantity}
                  </td>

                  <td>
                    ₹
                    {Number(
                      transaction.executionPrice
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹
                    {Number(
                      transaction.totalAmount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    {new Date(
                      transaction.createdAt
                    ).toLocaleString()}
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

export default Transactions;