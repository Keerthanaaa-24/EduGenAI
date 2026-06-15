import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Quiz from "./pages/Quiz";
import Summary from "./pages/Summary";
import Planner from "./pages/Planner";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/upload"
        element={<Upload />}
      />

      <Route
        path="/chat"
        element={<Chat />}
      />

      <Route
        path="/quiz"
        element={<Quiz />}
      />

      <Route
        path="/summary"
        element={<Summary />}
      />

      <Route
        path="/planner"
        element={<Planner />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="*"
        element={
          <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

export default App;