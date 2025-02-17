import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pagamento.css';
import { useNavigate } from 'react-router-dom';

const Pagamento = () => {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [total, setTotal] = useState(0);
  const [dadosPagamento, setDadosPagamento] = useState({
    numeroCartao: '',
    validade: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/carrinho', {
          params: { idUsuario: 1 } 
        });
        setCarrinho(response.data);
        const totalPedido = response.data.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        setTotal(totalPedido);
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
      }
    };
    fetchCarrinho();
  }, []);

  const handlePagamento = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/pagamento', {
        idUsuario: 1,
        itens: carrinho,
        total,
        metodoPagamento: 'cartao',
        numeroCartao: dadosPagamento.numeroCartao,
        validade: dadosPagamento.validade,
        cvv: dadosPagamento.cvv
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Erro no pagamento:', error);
    }
  };
  const voltar = () =>{
    navigate("/home")
  }
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
          {carrinho.map((item) => (
            <p key={item.idProduto}>{item.nome} - {item.quantidade} x R${item.preco}</p>
          ))}
          <h3>Total: R${total.toFixed(2)}</h3>
        </div>
        <div className="formulario">
          <h3>Detalhes do Pagamento</h3>
          <input type="text" placeholder="Número do Cartão" onChange={(e) => setDadosPagamento({...dadosPagamento, numeroCartao: e.target.value})} />
          <input type="text" placeholder="Validade (MM/AA)" onChange={(e) => setDadosPagamento({...dadosPagamento, validade: e.target.value})} />
          <input type="text" placeholder="CVV" onChange={(e) => setDadosPagamento({...dadosPagamento, cvv: e.target.value})} />
          <button onClick={handlePagamento}>Pagar</button>
          <button onClick={voltar}>Voltar</button>
        </div>
      </main>
      <footer>&copy; 2025 deChinelo, todos os direitos reservados.</footer>
    </div>
  );
};

export default Pagamento;
