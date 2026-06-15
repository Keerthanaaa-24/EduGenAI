import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>EduGen AI</h2>

      <ul>
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/upload">
            Upload Notes
          </Link>
        </li>

        <li>
          <Link to="/chat">
            AI Chat
          </Link>
        </li>

        <li>
          <Link to="/quiz">
            Quiz Generator
          </Link>
        </li>

        <li>
          <Link to="/summary">
            Summary
          </Link>
        </li>

        <li>
          <Link to="/planner">
            Study Planner
          </Link>
        </li>

        <li>
          <Link to="/analytics">
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;