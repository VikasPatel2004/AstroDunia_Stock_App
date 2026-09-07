import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const navLinks = [
    { to: "/",            label: "Stocks"       },
    { to: "/portfolio",   label: "Portfolio"    },
    { to: "/transactions",label: "Transactions" },
  ];

  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="AstroDunia" />
      </Link>

      {/* Nav Links */}
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

        {/* Cash Balance */}
        <span className="navbar-cash">
          {Number(user.balance).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </span>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;