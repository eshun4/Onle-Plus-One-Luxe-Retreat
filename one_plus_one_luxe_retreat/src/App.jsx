import LuxeHeader from "./components/LuxeHeader";
import Logo from "./components/Logo";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import Home from "./pages/Home/Home";
import useSmoothScroll from "./utils/useSmoothScroll";
import "./App.css";

function App() {
  useSmoothScroll();

  return (
    <div className="app">
      <CustomCursor />

      <LuxeHeader
        logo={<Logo size={64} className="site-logo" />}
        logoAlt="One Plus One Luxe Resort"
      />

      <Home />
    </div>
  );
}

export default App;
