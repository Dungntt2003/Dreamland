import { Navigate } from "react-router-dom";
import { useAuth } from "context/authContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated && role === "user") {
    return <Navigate to="/homepage" />;
  } else if (isAuthenticated && role === "restaurant_admin")
    return <Navigate to="/admin-page" />;

  return children;
};

export default PrivateRoute;
