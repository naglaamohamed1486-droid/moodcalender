import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Feed from "./pages/Feed";
import TripPlanner from "./pages/TripPlanner";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlaceDetails from "./pages/PlaceDetails";
import About from "./pages/About";
import Contributions from "./pages/Contributions";
import SavedTrips from "./pages/Savedtrips";
import Favorites from "./pages/Favorites";
import AddPlace from "./pages/AddPlace";
import "./App.css"


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

         
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="map" element={<Map />} />
            <Route path="feed" element={<Feed />} />
            <Route path="about" element={<About />} />
            <Route
              path="trip-plan"
              element={
                <ProtectedRoute>
                  <TripPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="contributions" element={
              <ProtectedRoute>
                <Contributions/>
               </ProtectedRoute>
             } />
            
            <Route path="savedtrips" element={
              <ProtectedRoute>
                <SavedTrips/>
               </ProtectedRoute>
             } />
            
            <Route path="favorites" element={
              <ProtectedRoute>
               <Favorites/>
               </ProtectedRoute>
             } />
            <Route path="addplace" element={
              <ProtectedRoute>
               <AddPlace/>
               </ProtectedRoute>
             } />
             <Route path="place/:id" element={
              <ProtectedRoute>
              <PlaceDetails />
              </ProtectedRoute>
              } />
            

          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 NOT FOUND</h1>} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;