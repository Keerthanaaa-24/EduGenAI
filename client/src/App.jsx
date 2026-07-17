import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
=======

import {
  useAuth,
} from "./context/AuthContext";

>>>>>>> d2968d4 (Add language selector and update planner, quiz, analytics features)
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
  const { user } =
    useAuth();

  const PrivateRoute = ({
    children,
  }) => {
    return user ? (
      children
    ) : (
      <Navigate
        to="/login"
        replace
      />
    );
  };

  return (
    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to="/dashboard"
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate
              to="/dashboard"
            />
          ) : (
            <Register />
          )
        }
      />

      {/* PROTECTED ROUTES */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <PrivateRoute>
            <Quiz />
          </PrivateRoute>
        }
      />

      <Route
        path="/summary"
        element={
          <PrivateRoute>
            <Summary />
          </PrivateRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <PrivateRoute>
            <Planner />
          </PrivateRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />

      {/* DEFAULT */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? "/dashboard"
                : "/login"
            }
          />
        }
      />

    </Routes>
  );
}

export default App;
