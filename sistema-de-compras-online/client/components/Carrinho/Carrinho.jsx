import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Carrinho.css';

const Carrinho = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const getUserId = () => {
    return localStorage.getItem("idUsuario");  // Recupera o id do usuário logado do localStorage
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const idUsuario = getUserId();
        if (!idUsuario) {
          navigate("/");  // Caso não tenha um usuário logado, redireciona para a página de login
          return;
        }
        const response = await Axios.get('http://localhost:3001/api/carrinho', {
          params: { idUsuario }, 
        });
        console.log(response.data); 
        const cartData = response.data.map(product => ({
          ...product,
          precoUnitario: product.preco || 0,
          imagemUrl: product.imagem ? `http://localhost:3001/uploads/${product.imagem}` : null, 
        }));
        setCart(cartData);
      } catch (error) {
        console.error('Erro ao carregar carrinho', error);
      }
    };

    loadCart();
  }, []);

  
  const comprarProdut = async () => {
    navigate("/pagamento", {
      state: {
        produtos: cart,
        total: cart.reduce((acc, product) => acc + product.precoUnitario * product.quantidade, 0),
      },
    });
  }

  const removeProduct = async (idProduto) => {
    const idUsuario = getUserId();
    if (!idUsuario) {
      navigate("/"); // Caso não tenha um usuário logado, redireciona para a página de login
      return;
    }
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
                  {product.imagemUrl ? (
                  <img src={product.imagemUrl} alt={product.nome} className="produtoImagem" />
                ) : (
                  <p>Imagem não disponível</p>
                )}
                <p>{product.nome}</p> 
                <p>R${formatPrice(product.precoUnitario)}</p>
                <p>{product.quantidade}</p> 
                <p>R${formatPrice(product.precoUnitario * product.quantidade)}</p>
                <button onClick={() => removeProduct(product.idProduto)}>Remover</button>
              </div>
            ))
          )}
        </div>
        <button onClick={comprarProdut}>Comprar Todos</button>
      </div>
    </div>
  );
};

export default Carrinho;
