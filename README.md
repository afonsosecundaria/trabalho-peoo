#  Sistema de compras online
// Ferramentas utilizadas
- React
- Nodejs
- Mysql

// Vídeo testando o sistema

https://github.com/user-attachments/assets/20fb1166-86ae-49cb-a9e4-75b6d0f628fd

// Código do banco de dados mysql 

  CREATE DATABASE SistemaVendas;
  USE SistemaVendas;
  
  CREATE TABLE Usuario (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      endereco TEXT NOT NULL,
      telefone VARCHAR(20) NOT NULL
  );
  
  CREATE TABLE Produto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT NOT NULL,
      preco FLOAT NOT NULL,
      quantidadeEmEstoque INT NOT NULL,
      categoria VARCHAR(255) NOT NULL
  );
  
  SELECT * FROM Produto;
  
  INSERT INTO Produto (id, nome, preco, quantidadeEmEstoque, categoria) VALUES (1, 'Camisa Chico Moedas', 50.00, 100, 1  );
  INSERT INTO Produto (id, nome, preco, quantidadeEmEstoque, categoria) VALUES (2, 'Camisa Neymar santos', 150.00, 100, 1);
  INSERT INTO Produto (id, nome, preco, quantidadeEmEstoque, categoria) VALUES (3, 'Perfume Jair', 200.00, 50, 2);
  
  
  CREATE TABLE Carrinho (
      id INT AUTO_INCREMENT PRIMARY KEY,
      idUsuario INT NOT NULL,
      FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
  );
  
  CREATE TABLE ItemCarrinho (
      id INT AUTO_INCREMENT PRIMARY KEY,
      idCarrinho INT NOT NULL,
      idProduto INT NOT NULL,
      quantidade INT NOT NULL,
      FOREIGN KEY (idCarrinho) REFERENCES Carrinho(id) ON DELETE CASCADE,
      FOREIGN KEY (idProduto) REFERENCES Produto(id) ON DELETE CASCADE
  );
  ALTER TABLE ItemCarrinho ADD COLUMN precoUnitario FLOAT NOT NULL;
  CREATE TABLE Pedido (
      id INT AUTO_INCREMENT PRIMARY KEY,
      idUsuario INT NOT NULL,
      FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
  );
  
  CREATE TABLE ItemPedido (
      id INT AUTO_INCREMENT PRIMARY KEY,
      idPedido INT NOT NULL,
      idProduto INT NOT NULL,
      quantidade INT NOT NULL,
      precoUnitario FLOAT NOT NULL,
      FOREIGN KEY (idPedido) REFERENCES Pedido(id) ON DELETE CASCADE,
      FOREIGN KEY (idProduto) REFERENCES Produto(id) ON DELETE CASCADE
  );
  
  CREATE TABLE Pagamento (
      id INT AUTO_INCREMENT PRIMARY KEY,
      idPedido INT NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      dataPagamento DATE NOT NULL,
      FOREIGN KEY (idPedido) REFERENCES Pedido(id) ON DELETE CASCADE
  );
