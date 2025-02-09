import { Routes, Route } from "react-router-dom";
import Login from "./App.jsx";
import Home from "../components/Home.jsx"

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  );
}

export default AppRoutes;