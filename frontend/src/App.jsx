import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StockDetails from "./pages/StockDetails";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Public routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected routes */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stocks/:id"
            element={
              <ProtectedRoute>
                <StockDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;