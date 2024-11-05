import { Route, Routes } from "react-router-dom";
import Register from "views/pages/register/register";
import MainLayout from "components/layout/main-layout";
const AllRoutes = () => {
  return (
    <Routes>
      <Route
        path="/register"
        element={<MainLayout component={<Register />} />}
      />
    </Routes>
  );
};

export default AllRoutes;
