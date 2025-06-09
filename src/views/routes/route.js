import { useAuth } from "context/authContext";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Register from "views/pages/register/register";
import Login from "views/pages/login/login";
import MainLayout from "components/layout/main-layout";
import Homepage from "views/pages/homepage/homepage";
import NotFound from "views/pages/404/notFound";
import LandingPage from "views/pages/landing-page/landingPage";
import PersonalInfo from "views/pages/personal-info/personalInfo";
import CreateTrip from "views/pages/trip/create-trip/createTrip";
import Step1 from "views/pages/trip/create-trip/step1/step1";
import SightDetail from "views/pages/sightseeing/sight-detail/sightDetail";
import EnterDetail from "views/pages/entertainment/entertainment-detail/enterDetail";
import RestaurantDetail from "views/pages/restaurant/restaurant-detail/restaurant-detail";
import HotelDetail from "views/pages/hotel/hotel-detail/hotelDetail";
import DraggableCalendar from "views/pages/timetable/schedule";
import ScheduleDetail from "views/pages/schedule-detail/scheduleDetail";
import SightList from "views/pages/sightseeing/sight-list/sightList";
import EntertainmentList from "views/pages/entertainment/entertainment-list/entertainment-list";
import RestaurantList from "views/pages/restaurant/restaurant-view/restaurant-list";
import HotelList from "views/pages/hotel/hotel-list/hoteList";
import RepoList from "views/pages/repository/repo-list/repo-list";
import RepoMap from "views/pages/map/repo-map";
import VNPayPayment from "views/pages/payment/payment";
import LikedService from "views/pages/liked-service/liked-service";
import PaymentResult from "views/pages/payment/payment-result";
import AIGen from "views/pages/ai-gen/testAiGen";
import ScheduleEdit from "views/pages/schedule-detail/schedule-edit";
import VoiceText from "views/pages/test/tts";
import PaymentService from "views/pages/payment-service/payment-service";
import EnterProcess from "views/pages/payment-service/process/enter-process";
import RestaurantProcess from "views/pages/payment-service/process/restaurant-process";
import HotelPaymentProcess from "views/pages/payment-service/process/hotel-process";
import PaymentResultRestaurant from "views/pages/result/order-restaurant";
import PaymentInfo from "views/pages/payment/payment-result-service/payment-info";
import RepoHidden from "views/pages/repository/repo-list/repo-hidden";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Đang kiểm tra xác thực...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    alert("Bạn cần đăng nhập để truy cập trang này");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }
  return children;
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route
        path="/register"
        element={
          <PublicRoute>
            <MainLayout component={<Register />} />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <MainLayout component={<Login />} />
          </PublicRoute>
        }
      />
      <Route
        path="/homepage"
        element={<MainLayout component={<Homepage />} />}
      />
      <Route
        path="/sight-seeing-detail/:id"
        element={<MainLayout component={<SightDetail />} />}
      />
      <Route
        path="/entertainment-detail/:id"
        element={<MainLayout component={<EnterDetail />} />}
      />
      <Route
        path="/restaurant-detail/:id"
        element={<MainLayout component={<RestaurantDetail />} />}
      />
      <Route
        path="/hotel-detail/:id"
        element={<MainLayout component={<HotelDetail />} />}
      />
      <Route path="/sight" element={<MainLayout component={<SightList />} />} />
      <Route
        path="/entertainment"
        element={<MainLayout component={<EntertainmentList />} />}
      />
      <Route
        path="/restaurant"
        element={<MainLayout component={<RestaurantList />} />}
      />
      <Route path="/hotel" element={<MainLayout component={<HotelList />} />} />

      <Route
        path="/personal-info/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<PersonalInfo />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-trip-step1/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<Step1 />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-trip"
        element={
          <PrivateRoute>
            <MainLayout component={<CreateTrip />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<DraggableCalendar />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule-detail/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<ScheduleDetail />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/favorite"
        element={
          <PrivateRoute>
            <MainLayout component={<LikedService />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule-edit/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<ScheduleEdit />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/api/v1/payment/vnpay-return"
        element={
          <PrivateRoute>
            <MainLayout component={<PaymentResult />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/repository"
        element={
          <PrivateRoute>
            <MainLayout component={<RepoList />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/repository/hidden"
        element={
          <PrivateRoute>
            <MainLayout component={<RepoHidden />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/repo-map/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<RepoMap />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/vnpay"
        element={
          <PrivateRoute>
            <MainLayout component={<VNPayPayment />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-info"
        element={
          <PrivateRoute>
            <MainLayout component={<PaymentInfo />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-enter"
        element={
          <PrivateRoute>
            <MainLayout component={<EnterProcess />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-restaurant"
        element={
          <PrivateRoute>
            <MainLayout component={<RestaurantProcess />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/order-restaurant"
        element={
          <PrivateRoute>
            <MainLayout component={<PaymentResultRestaurant />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-hotel"
        element={
          <PrivateRoute>
            <MainLayout component={<HotelPaymentProcess />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-service/:id"
        element={
          <PrivateRoute>
            <MainLayout component={<PaymentService />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/voice-text"
        element={
          <PrivateRoute>
            <MainLayout component={<VoiceText />} />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat-ai"
        element={
          <PrivateRoute>
            <MainLayout component={<AIGen />} />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<LandingPage />} />
      <Route path="/notFound" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/notFound" replace />} />
    </Routes>
  );
};

export default AllRoutes;
