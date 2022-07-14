import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, isProtected }) => {
  const isAuth = !!localStorage.getItem("token");

  if (isProtected && !isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtected && isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};
