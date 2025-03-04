import React, { useState, useEffect} from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

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
    navigate("/pagamento",  {
      state: {
        produtos: [produto],  
        total: produto.preco,
      },
    });
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
        {produtos.map((produto) => (
          <div className="product" key={produto.id}>
            <img src={`http://localhost:3001/uploads/${produto.imagem}`} alt={produto.nome} />
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
            <p>R${produto.preco.toFixed(2)}</p>
            <button onClick={() => comprarproduto(produto)}>Comprar Produto</button>
            <button onClick={() => handleAddToCart(produto)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/addproduto')}>Cadastrar Produto</button>
      <footer>&copy; 2025 deChinelo, todos os direitos reservados.</footer>
    </div>
  );
};

export default Home;
