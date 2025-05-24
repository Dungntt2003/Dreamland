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
      <Route
        path="/schedule/:id"
        element={<MainLayout component={<DraggableCalendar />} />}
      />
      <Route
        path="/schedule-detail/:id"
        element={<MainLayout component={<ScheduleDetail />} />}
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
        path="/favorite"
        element={<MainLayout component={<LikedService />} />}
      />
      <Route
        path="/schedule-edit/:id"
        element={<MainLayout component={<ScheduleEdit />} />}
      />
      <Route
        path="/api/v1/payment/vnpay-return"
        element={<MainLayout component={<PaymentResult />} />}
      />
      <Route
        path="/repository"
        element={<MainLayout component={<RepoList />} />}
      />
      <Route
        path="/repository/hidden"
        element={<MainLayout component={<RepoHidden />} />}
      />
      <Route
        path="/repo-map/:id"
        element={<MainLayout component={<RepoMap />} />}
      />
      <Route
        path="/vnpay"
        element={<MainLayout component={<VNPayPayment />} />}
      />
      <Route
        path="/payment-info"
        element={<MainLayout component={<PaymentInfo />} />}
      />
      <Route
        path="/payment-enter"
        element={<MainLayout component={<EnterProcess />} />}
      />
      <Route
        path="/payment-restaurant"
        element={<MainLayout component={<RestaurantProcess />} />}
      />
      <Route
        path="/order-restaurant"
        element={<MainLayout component={<PaymentResultRestaurant />} />}
      />
      <Route
        path="/payment-hotel"
        element={<MainLayout component={<HotelPaymentProcess />} />}
      />
      <Route
        path="/payment-service/:id"
        element={<MainLayout component={<PaymentService />} />}
      />
      <Route
        path="/voice-text"
        element={<MainLayout component={<VoiceText />} />}
      />
      <Route path="/chat-ai" element={<MainLayout component={<AIGen />} />} />
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
