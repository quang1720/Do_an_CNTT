import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Main } from "./pages/Main";
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
              <Main />
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
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
