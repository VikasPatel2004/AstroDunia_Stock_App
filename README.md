# AstroDunia Stock Trading App

A modern, high-fidelity stock trading web application built with the MERN stack. Designed with a premium "Fintech" aesthetic (inspired by top modern brokerage apps), it provides a fast, data-rich interface for viewing stocks, managing portfolios, and executing simulated trades.

## 🚀 Key Features

* **Premium Fintech UI/UX:** Clean, data-dense layouts with a cohesive "Light Red" theme. Includes responsive grids, custom tables, sparkline charts, and interactive filter pills.
* **Authentication:** Secure user login and registration system. 
* **Intraday Screener Dashboard:** A comprehensive, sortable data table showcasing live market prices, 1D changes, volume, and 52W high/low sliders alongside inline SVG sparklines.
* **Detailed Trading View:** Select any stock to see a dedicated, detailed view where users can place Buy and Sell orders. Features real-time balance calculations and execution policy details.
* **Portfolio Management:** Tracks user holdings, total invested amount, current valuation, and overall Profit & Loss (P&L). Includes an interactive P&L graph.
* **Transaction History:** A dedicated list-detail table layout allowing users to view, sort, and filter their historical trades (Buy/Sell) with summary stat cards (Total Trades, Volume).

## 🛠️ Tech Stack

### Frontend
* **React** (via Vite): A fast and modern UI library for building dynamic interfaces.
* **React Router Dom:** For seamless navigation across dashboard, portfolio, details, and transaction pages.
* **Vanilla CSS:** Custom design system built with utility variables, avoiding heavy CSS frameworks to maintain complete aesthetic control.
* **Material UI (MUI) Icons:** High-quality vector icons (`@mui/icons-material`) used consistently throughout the application for a polished look.

### Backend
* **Node.js & Express:** Robust REST API to handle user authentication, stock fetching, and trade execution.
* **MongoDB:** NoSQL database to store user profiles, stock metadata, portfolio holdings, and transaction records.

## 📁 Project Structure

```text
machine-round-app/
├── backend/                # Node.js Express server
│   ├── models/             # Mongoose schemas (User, Stock, Transaction)
│   ├── routes/             # API endpoints (Auth, Stocks, Portfolio)
│   ├── middleware/         # Auth verification guards
│   └── index.js            # Server entry point
└── frontend/               # Vite React application
    ├── src/
    │   ├── assets/         # Static images and SVGs
    │   ├── components/     # Reusable UI (Navbar, ProtectedRoute)
    │   ├── context/        # Global state (AuthContext)
    │   ├── pages/          # App Views (Dashboard, Portfolio, Transactions, StockDetails)
    │   ├── services/       # Axios API integrations
    │   ├── index.css       # Core design system and global styles
    │   └── main.jsx        # React entry point
    └── package.json
```

## 🏁 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* MongoDB (Local instance or MongoDB Atlas URI)

### 1. Setup Backend
1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and configure your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root and configure your API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

## 🎨 Design System

The application relies strictly on a deterministic, custom-built CSS architecture found in `index.css`.
* **Colors:** Leverages a cohesive Light Red/Rose primary brand color (`#f43f5e`) balanced with stark whites, soft greys (`#f1f2f6`), and semantic greens (`#00d09c`) for profit indications.
* **Typography:** Clean, sans-serif web fonts (e.g., Inter/Roboto) with careful attention to font weights and tabular numerals.
* **Components:** Custom CSS classes for `dt-table`, `trade-layout`, `tx-stat-card`, and `live-badge` ensure components look identical to high-end financial platforms without the overhead of external CSS UI libraries.
