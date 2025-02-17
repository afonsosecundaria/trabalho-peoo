import React from 'react';
import './Sobre.css'; 

const Sobre = () => {
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
      <div className="containerSobre">
        <div>
          <h1>Somos alunos do IFRN</h1>
          <a href="https://github.com/gnarciso27">Visitar git Guilherme</a>
          <br />
          <br />
          <a href="https://github.com/afonsosecundaria">Visitar git Afonso</a>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
