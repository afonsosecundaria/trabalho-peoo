import React from 'react';
import './home.css'

const Home = () => {
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

      <div className="hero">
        <h1>Bem-Vindo a nossa loja</h1>
        <p>Descubra os melhores produtos e melhores ofertas!</p>
        <button>Comprar agora</button>
      </div>

      <div className="products">
        <div className="product">
          <img src="/assets/download (1).jpg" alt="Product 1" />
          <h2>Produto 1</h2>
          <p>R$10.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
        <div className="product">
          <img src="/assets/download (2).jpg" alt="Product 2" />
          <h2>Produto 2</h2>
          <p>R$20.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
        <div className="product">
          <img src="/assets/download.jpg" alt="Product 3" />
          <h2>Produto 3</h2>
          <p>R$30.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
      </div>

      <footer>
        &copy; 2025 deChinelo, todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;
