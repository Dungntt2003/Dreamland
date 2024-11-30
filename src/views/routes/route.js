import { Route, Routes } from "react-router-dom";
import Register from "views/pages/register/register";
import Login from "views/pages/login/login";
import MainLayout from "components/layout/main-layout";
import Homepage from "views/pages/homepage/homepage";
import ProtectedRoute from "./protectedRoute";
import NotFound from "views/pages/404/notFound";
import AdminPage from "views/pages/admin-page/adminPage";
import PrivateRoute from "./privateRoute";
import LandingPage from "views/pages/landing-page/landingPage";
import PersonalInfo from "views/pages/personal-info/personalInfo";
import CreateTrip from "views/pages/trip/create-trip/createTrip";
import Step1 from "views/pages/trip/create-trip/step1/step1";
import SightDetail from "views/pages/sightseeing/sight-detail/sightDetail";
import Test from "views/pages/sightseeing/sight-detail/test";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/register"
        element={
          <PrivateRoute>
            <MainLayout component={<Register />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PrivateRoute>
            <MainLayout component={<Login />} />
          </PrivateRoute>
        }
      />
      <Route path="/notFound" element={<NotFound />} />
      <Route
        path="/personal-info/:id"
        element={<MainLayout component={<PersonalInfo />} />}
      />
      <Route
        path="/create-trip-step1/:id"
        element={<MainLayout component={<Step1 />} />}
      />
      <Route
        path="/create-trip"
        element={<MainLayout component={<CreateTrip />} />}
      />
      <Route path="/test" element={<MainLayout component={<Test />} />} />
      <Route
        path="/sight-seeing-detail/:id"
        element={<MainLayout component={<SightDetail />} />}
      />
      <Route element={<ProtectedRoute requiredRole="user" />}>
        <Route
          path="/homepage"
          element={<MainLayout component={<Homepage />} />}
        />
      </Route>

      <Route element={<ProtectedRoute requiredRole="restaurant_admin" />}>
        <Route
          path="/admin-page"
          element={<MainLayout component={<AdminPage />} />}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
