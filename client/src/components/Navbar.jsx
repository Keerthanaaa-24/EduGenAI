import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const { logout } = useAuth();
  const navigate =
    useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };
  return (
    <nav className="modern-navbar">

      <div className="logo">
        <span className="logo-e">
          Edu
        </span>

        <span className="logo-g">
          Gen
        </span>

        <span className="logo-ai">
          AI
        </span>
      </div>

      <div className="nav-links">

        <Link
          className="nav-btn"
          to="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="nav-btn"
          to="/upload"
        >
          Upload
        </Link>

        <Link
          className="nav-btn"
          to="/chat"
        >
          Chat
        </Link>

        <Link
          className="nav-btn"
          to="/quiz"
        >
          Quiz
        </Link>

        <Link
          className="nav-btn"
          to="/summary"
        >
          Summary
        </Link>

        <Link
          className="nav-btn"
          to="/planner"
        >
          Planner
        </Link>

        <Link
          className="nav-btn"
          to="/analytics"
        >
          Analytics
        </Link>

        <button
          className="logout-btn"
          onClick={
            handleLogout
          }
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
