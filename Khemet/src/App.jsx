import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Layout from "./components/Layout";
import ProtectRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

         
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            

            <Route
              path="search"
              element={
                <ProtectRoute>
                  <Search />
                </ProtectRoute>
              }
            />

          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 NOT FOUND</h1>} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;