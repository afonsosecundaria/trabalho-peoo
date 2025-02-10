import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Carrinho.css';

const Carrinho = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  // Carregar produtos do carrinho ao acessar a página
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await Axios.get('http://localhost:3001/api/carrinho', {
          params: { idUsuario: 1 }, // Usando idUsuario para identificar o carrinho do usuário
        });
        setCart(response.data); // Supondo que a resposta seja uma lista de itens no carrinho
      } catch (error) {
        console.error('Erro ao carregar carrinho', error);
      }
    };

    loadCart();
  }, []);

  // Adicionar um produto ao carrinho
  const addProduct = async (produto) => {
    try {
      await Axios.post('http://localhost:3001/api/carrinho/adicionar', {
        idUsuario: 1, // Supondo id do usuário seja 1
        idProduto: produto.id,
        quantidade: 1,
        precoUnitario: produto.preco,
      });

      alert('Produto adicionado ao carrinho!');
      navigate('/carrinho'); // Redireciona para a página do carrinho
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };

  // Remover produto do carrinho
  const removeProduct = (id) => {
    setCart(cart.filter(product => product.id !== id));
    // Você pode fazer uma requisição ao backend para remover o item do carrinho
  };

  return (
    <div className='containerCarrinho'>
      <header>
        <div className="logo">deChinelo</div>
        <nav>
          <a href="/home">Home</a>
          <a href="/shop">Shop</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/sobre">Sobre</a>
          <a href="/">Entrar</a>
        </nav>
      </header>

      <div className='formCarrinho'>
        <div className="buscarprodutos">
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Aqui você poderia mapear os produtos encontrados com base na busca */}
        </div>

        <div className='tabelaprodutos'>
          <p>Produto</p>
          <p>Preço Unitário</p>
          <p>Quantidade</p>
          <p>Preço Total</p>
          <p>Ações</p>
        </div>

        <div className='carrinhoProdutos'>
          {cart.length === 0 ? (
            <p>Ainda nenhum produto no carrinho</p>
          ) : (
            cart.map((product) => (
              <div key={product.id} className="produto">
                <p>{product.nome}</p> {/* Ajuste o nome do produto conforme necessário */}
                <p>R${product.precoUnitario}</p>
                <p>{product.quantidade}</p>
                <p>R${(product.precoUnitario * product.quantidade).toFixed(2)}</p>
                <button onClick={() => removeProduct(product.id)}>Remover</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
