import React from 'react';
import './Carrinho.css'

const Carrinho = () => {
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
            <input type="text" />
            <button>Pesquisar</button>
        </div>

        <div className='tabelaprodutos'>
          <div className="produto">
            <p>Produto</p>
          </div>
          <p>Preço Unitário</p>
          <p>Quantidade</p>
          <p>Preço Total</p>
          <p>Ações</p>
        </div>

        <div className='carrinhoProdutos'>
          Ainda nenhum produto
        </div>



      </div>
    </div>
  );
};

export default Carrinho;
