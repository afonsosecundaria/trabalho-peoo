import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Carrinho.css';

const Carrinho = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await Axios.get('http://localhost:3001/api/carrinho', {
          params: { idUsuario: 1 }, 
        });
        setCart(response.data);
      } catch (error) {
        console.error('Erro ao carregar carrinho', error);
      }
    };

    loadCart();
  }, []);

  const addProduct = async (produto) => {
    try {
      await Axios.post('http://localhost:3001/api/carrinho/adicionar', {
        idUsuario: 1,
        idProduto: produto.id,
        quantidade: 1,
        precoUnitario: produto.preco,
      });
  
      const response = await Axios.get('http://localhost:3001/api/carrinho', {
        params: { idUsuario: 1 },
      });
      setCart(response.data || []);
  
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };
  
  const comprarProdut = async (idProduto) => {
    navigate("/pagamento");
  }

  const removeProduct = async (idProduto) => {
    const idUsuario = 1;
    console.log("Removendo produto para idUsuario:", idUsuario);
    console.log("Produto ID:", idProduto);
    try {
      await Axios.delete('http://localhost:3001/api/carrinho/remover', {
        params: {idProduto, idUsuario },
      });
      const response = await Axios.get('http://localhost:3001/api/carrinho', {
        params: { idUsuario },
      });
      setCart(response.data || []);
    } catch (error) {
      console.error('Erro ao remover produto do carrinho', error);
    }
  };
  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return "0.00";
    }
    return price.toFixed(2);
  };

  return (
    <div className='containerCarrinho'>
      <header>
        <div className="logo">deChinelo</div>
        <nav>
          <a href="/home">Home</a>
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
              <div key={product.idProduto} className="produto">
                <img src={product.imagem} alt={product.nome} className="produtoImagem" /> 
                <p>{product.nome}</p> 
                <p>R${formatPrice(product.precoUnitario)}</p>
                <p>{product.quantidade}</p> 
                <p>R${formatPrice(product.precoUnitario * product.quantidade)}</p>
                <button onClick={() => removeProduct(product.idProduto)}>Remover</button>
                <button onClick={() => comprarProdut(product.idProduto)}>Comprar</button>
              </div>
            ))
          )}
        </div>
        <button onClick={() => comprarProdut(product.idProduto)}>Comprar</button>
      </div>
    </div>
  );
};

export default Carrinho;
