import { Outlet } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Body from "./components/Body";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ConverterBox from "./components/ConverterBox";
import ConverterPage from "./components/ConverterPage";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
