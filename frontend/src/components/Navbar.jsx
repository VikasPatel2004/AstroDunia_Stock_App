import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    navigate(`/?q=${e.target.value}`);
  };

  const navLinks = [
    { to: "/",             label: "Stocks"       },
    { to: "/portfolio",    label: "Portfolio"    },
    { to: "/transactions", label: "Transactions" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="AstroDunia" />
          </Link>

          {user && (
            <nav>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? "active" : ""}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="navbar-right">
          <div className="navbar-search">
            <span className="search-icon"><SearchIcon sx={{ fontSize: 16 }} /></span>
            <input
              id="search-input"
              type="text"
              placeholder="Search AstroDunia..."
              value={query}
              onChange={handleSearch}
            />
            <span className="kb-shortcut">Ctrl+K</span>
          </div>

          {user ? (
            <>
              <span className="navbar-cash" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
                ₹{Number(user.balance).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
              <button className="logout-btn" onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="logout-btn" style={{ textDecoration: 'none' }}>
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;