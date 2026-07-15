import { Route, Routes } from "react-router-dom";
import Layout from "../shared/components/Layout";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Home from "../pages/Home";
import Map from "../features/map/Map";
import Feed from "../features/feed/Feed";
import TripPlanner from "../features/trip-generator/TripPlanner";
import Profile from "../features/profile/Profile";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import PlaceDetails from "../features/places/PlaceDetails";
import About from "../pages/About";
import Contributions from "../features/contribution/Contributions";
import SavedTrips from "../features/saved-places/SavedTrips";
import Favorites from "../features/favourites/Favorites";
import AddPlace from "../features/contribution/AddPlace";
import Booking from "../features/booking/Booking";
import Submissions from "../features/submissions/Submissions";
import Unauthorized from "../features/auth/Unauthorized";
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminUsers from "../features/admin/AdminUsers";
import AdminReports from "../features/admin/AdminReports";
import NotFound from "../pages/NotFound";
import MyBookings from "../features/booking/MyBookings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="map" element={<Map />} />
        <Route
          path="feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route
          path="trip-plan"
          element={
            <ProtectedRoute role="user">
              <TripPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="contributions"
          element={
            <ProtectedRoute>
              <Contributions />
            </ProtectedRoute>
          }
        />
        <Route
          path="savedtrips"
          element={
            <ProtectedRoute role="user">
              <SavedTrips />
            </ProtectedRoute>
          }
        />
        <Route
          path="submissions"
          element={
            <ProtectedRoute role="admin">
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="adminUsers"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="adminReports"
          element={
            <ProtectedRoute role="admin">
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute role="user">
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="addplace"
          element={
            <ProtectedRoute>
              <AddPlace />
            </ProtectedRoute>
          }
        />
        <Route
          path="place/:id"
          element={
            <ProtectedRoute>
              <PlaceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-planner"
          element={
            <protectedRoute>
              <TripPlanner />
            </protectedRoute>
          
        }
      />
      </Route>
      

      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default AppRoutes;
