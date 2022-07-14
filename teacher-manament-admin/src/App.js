import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Login } from "./pages/Login";
import "antd/dist/antd.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute isProtected>
              <PrivateRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
