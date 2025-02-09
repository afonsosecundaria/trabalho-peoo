import { Routes, Route } from "react-router-dom";
import Login from "./App.jsx";
import Home from "../components/Home/Home.jsx"
import Sobre from "../components/Sobre/Sobre.jsx"

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
  );
}

export default AppRoutes;