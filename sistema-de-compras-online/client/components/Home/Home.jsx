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
        <p>Aqui você encontra os melhores produtos com as melhores ofertas!</p>
        <button>Comprar agora</button>
      </div>

      <div className="products">
        <div className="product">
          <img src="../public/imagens/chicomoedas.jpeg" alt="Product 1" />
          <h2>Camisa do Chico Moedas</h2>
          <p>R$50.00</p>
          <button>Comprar Produto</button>
          <button>Adicionar ao Carrinho</button>
        </div>
        <div className="product">
          <img src="../public/imagens/neymar.jpeg" alt="Product 2" />
          <h2>Camisa do Neymar no Santos</h2>
          <p>R$150.00</p>
          <button>Comprar Produto</button>
          <button>Adicionar ao Carrinho</button>
        </div>
        <div className="product">
          <img src="../public/imagens/jair.jpg" alt="Product 3" />
          <h2>Perfume Jair</h2>
          <p>R$200.00</p>
          <button>Comprar Produto</button>
          <button>Adicionar ao Carrinho</button>
        </div>
      </div>

      <footer>
        &copy; 2025 deChinelo, todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;
