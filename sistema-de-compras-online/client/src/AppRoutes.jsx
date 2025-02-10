import { Routes, Route } from "react-router-dom";
import Login from "../components/LogineCadastro/LogineCadastro.jsx";
import Home from "../components/Home/Home.jsx"
import Sobre from "../components/Sobre/Sobre.jsx"
import Carrinho from "../components/Carrinho/Carrinho.jsx";
import Pagamento from "../components/Pagamento/Pagamento.jsx";


function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/pagamento" element={<Pagamento />} />
      </Routes>
  );
}

export default AppRoutes;