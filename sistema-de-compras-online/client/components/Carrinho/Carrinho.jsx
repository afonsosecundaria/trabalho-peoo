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
        idUsuario: 1,
        idProduto: produto.id,
        quantidade: 1,
        precoUnitario: produto.preco,
      });
  
      // Recarregar o carrinho após adicionar o produto
      const response = await Axios.get('http://localhost:3001/api/carrinho', {
        params: { idUsuario: 1 },
      });
      setCart(response.data); // Atualiza o carrinho com os novos dados do servidor
  
      alert('Produto adicionado ao carrinho!');
      navigate('/carrinho');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };
  

  // Remover produto do carrinho
  const removeProduct = async (id) => {
    try {
      await Axios.post('http://localhost:3001/api/carrinho/remover', { idProduto: id, idUsuario: 1 });
      setCart(cart.filter(product => product.id !== id));
    } catch (error) {
      console.error('Erro ao remover produto do carrinho', error);
    }
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
                <img src={product.imagem} alt={product.nome} className="produtoImagem" /> {/* Exibir a imagem */}
                <p>{product.nome}</p> {/* Nome do produto */}
                <p>R${product.precoUnitario.toFixed(2)}</p> {/* Preço unitário */}
                <p>{product.quantidade}</p> {/* Quantidade */}
                <p>R${(product.precoUnitario * product.quantidade).toFixed(2)}</p> {/* Preço total */}
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
