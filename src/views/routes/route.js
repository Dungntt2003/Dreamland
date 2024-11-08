import { Route, Routes } from "react-router-dom";
import Register from "views/pages/register/register";
import Login from "views/pages/login/login";
import MainLayout from "components/layout/main-layout";
import ProtectedRoute from "./protectedRoute";
import Homepage from "views/pages/homepage/homepage";
const AllRoutes = () => {
  return (
    <Routes>
      <Route
        path="/register"
        element={<MainLayout component={<Register />} />}
      />
      <Route path="/login" element={<MainLayout component={<Login />} />} />
      <ProtectedRoute
        path="/homepage"
        element={<MainLayout component={<Homepage />} />}
      />
    </Routes>
  );
};

export default AllRoutes;
