import { useAuth } from "context/authContext";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    if (role === "user") {
      return <Navigate to="/homepage" />;
    } else if (role === "restaurant_admin") {
      return <Navigate to="/admin-page" />;
    }
  }
  return children;
};

export default PrivateRoute;
