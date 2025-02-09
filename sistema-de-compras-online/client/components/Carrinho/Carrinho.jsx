import React from 'react';
import './Carrinho.css'

const Carrinho = () => {
  return (
    <div>
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
    </div>
  );
};

export default Carrinho;
