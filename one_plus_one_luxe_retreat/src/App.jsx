import LuxeHeader from "./components/LuxeHeader";
import Logo from "./components/Logo";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import Home from "./pages/Home/Home";
import Stay from "./pages/Stay/Stay";
import Gallery from "./pages/Gallery/Gallery";
import Amenities from "./pages/Amenities/Amenities";
import Location from "./pages/Location/Location";
import Reviews from "./pages/Reviews/Reviews";
import Faq from "./pages/Faq/Faq";
import useSmoothScroll from "./utils/useSmoothScroll";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import AdminAuthGate from "./pages/AdminDashboard/AdminAuthGate.jsx";

function App() {
  useSmoothScroll();
  if (window.location.pathname === "/admin") {
    return <AdminAuthGate />;
  }
  return (
    <div className="app">
      <CustomCursor />

      <LuxeHeader
        logo={<Logo size={64} className="site-logo" />}
        logoAlt="One Plus One Luxe Retreat"
      />

      <Home />

      <Stay />

      <Gallery />

      <Amenities />

      <Location />

      <Reviews />

      <Faq />
    </div>
  );
}

export default App;
