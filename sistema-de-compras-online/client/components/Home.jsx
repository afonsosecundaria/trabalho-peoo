import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}> 
      <header className={styles.header}> 
        <div className={styles.logo}>deChinelo</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="/sistema-de-compras-online/client/public/htmls_extras/sobre.html">Sobre</a>
          <a href="#">Contato</a>
        </nav>
      </header>

      <div className={styles.hero}>
        <h1>Bem-Vindo a nossa loja</h1>
        <p>Descubra os melhores produtos e melhores ofertas!</p>
        <button>Comprar agora</button>
      </div>

      <div className={styles.products}>
        <div className={styles.product}>
          <img src="/assets/download (1).jpg" alt="Product 1" />
          <h2>Produto 1</h2>
          <p>R$10.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
        <div className={styles.product}>
          <img src="/assets/download (2).jpg" alt="Product 2" />
          <h2>Produto 2</h2>
          <p>R$20.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
        <div className={styles.product}>
          <img src="/assets/download.jpg" alt="Product 3" />
          <h2>Produto 3</h2>
          <p>R$30.00</p>
          <button>Adicionar ao carrinho</button>
        </div>
      </div>

      <footer className={styles.footer}>
        &copy; 2025 deChinelo, todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;
