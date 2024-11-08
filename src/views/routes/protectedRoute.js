import { getToken } from "services/authService";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getToken() ? <Component {...props} /> : <Navigate to="/login" />
    }
  />
);

export default ProtectedRoute;
