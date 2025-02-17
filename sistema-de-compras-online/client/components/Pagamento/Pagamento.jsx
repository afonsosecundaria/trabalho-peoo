import React, { useState, useEffect } from 'react';
import './Pagamento.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Pagamento = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Acessar o estado passado da navegação
  const { produtos, total } = location.state || {}; // Pegar os dados passados pelo state

  const [dadosPagamento, setDadosPagamento] = useState({
    numeroCartao: '',
    validade: '',
    cvv: ''
  });

  const handlePagamento = async () => {
    try {
      // Aqui seria o lugar onde você faria a requisição para um backend
      // Para simular o pagamento
      alert(`Pagamento realizado com sucesso! Total: R$${total.toFixed(2)}`);
      navigate("/home"); // Navegar para a home após o pagamento
    } catch (error) {
      console.error('Erro no pagamento:', error);
    }
  };

  const voltar = () => {
    navigate("/home"); // Voltar para a página inicial
  };

  return (
    <div className="container">
      <header>
        <div className="logo">deChinelo</div>
        <nav>
          <a href="/home">Home</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/sobre">Sobre</a>
          <a href="/">Entrar</a>
        </nav>
      </header>
      <main>
        <h2>Pagamento</h2>
        <div className="resumo">
          <h3>Resumo do Pedido</h3>
          {produtos && produtos.map((item) => (
            <p key={item.id}>{item.nome} - 1 x R${item.preco.toFixed(2)}</p> // Produto enviado da página Home
          ))}
          <h3>Total: R${total.toFixed(2)}</h3>
        </div>
        <div className="formulario">
          <h3>Detalhes do Pagamento</h3>
          <input 
            type="text" 
            placeholder="Número do Cartão" 
            onChange={(e) => setDadosPagamento({...dadosPagamento, numeroCartao: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="Validade (MM/AA)" 
            onChange={(e) => setDadosPagamento({...dadosPagamento, validade: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="CVV" 
            onChange={(e) => setDadosPagamento({...dadosPagamento, cvv: e.target.value})} 
          />
          <button onClick={handlePagamento}>Pagar</button>
          <button onClick={voltar}>Voltar</button>
        </div>
      </main>
      <footer>&copy; 2025 deChinelo, todos os direitos reservados.</footer>
    </div>
  );
};

export default Pagamento;
