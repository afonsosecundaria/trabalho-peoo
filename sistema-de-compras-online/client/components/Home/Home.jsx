import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const handleAddToCart = async (produto) => {
    try {
      const response = await Axios.post("http://localhost:3001/api/carrinho/adicionar", {
        idUsuario: 1, 
        idProduto: produto.id,
        quantidade: 1, 
        precoUnitario: produto.preco,
      });

      if (response.status === 200) {
        alert("Produto adicionado ao carrinho!");
        navigate("/carrinho");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error.response ? error.response.data : error);
    }
  };
  const comprarproduto = async (produto) =>{
    navigate("/pagamento");
  }

  return (
    <div>
      <header>
        <div className="logo">deChinelo</div>
        <nav>
          <a href="/home">Home</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/sobre">Sobre</a>
          <a href="/">Entrar</a>
        </nav>
      </header>

      <div className="hero">
        <h1>Bem-Vindo a nossa loja</h1>
        <p>Aqui você encontra os melhores produtos com as melhores ofertas!</p>
      </div>

      <div className="products">
        {[
          {
            id: 1,
            nome: "Camisa do Chico Moedas",
            preco: 50.0,
            imagem: "/imagens/chicomoedas.jpeg",
          },
          {
            id: 2,
            nome: "Camisa do Neymar no Santos",
            preco: 150.0,
            imagem: "/imagens/neymar.jpeg",
          },
          {
            id: 3,
            nome: "Perfume Jair",
            preco: 200.0,
            imagem: "/imagens/jair.jpg",
          },
        ].map((produto) => (
          <div className="product" key={produto.id}>
            <img src={produto.imagem} alt={produto.nome} />
            <h2>{produto.nome}</h2>
            <p>R${produto.preco.toFixed(2)}</p>
            <button onClick={() => comprarproduto(produto)}>Comprar Produto</button>
            <button onClick={() => handleAddToCart(produto)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>

      <footer>&copy; 2025 deChinelo, todos os direitos reservados.</footer>
    </div>
  );
};

export default Home;
