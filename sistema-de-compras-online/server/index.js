const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "SistemaVendas",
});

app.use(express.json());
app.use(cors());

// logica do login e cadastro do site

app.post("/cadastro", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const telefone = req.body.telefone;
  const password = req.body.password;


  db.query("SELECT * FROM Usuario WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result && result.length === 0) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err){
          return res.send(err);
        }
        db.query(
          "INSERT INTO Usuario (nome, email, telefone, endereco, senha) VALUES (?,?,?,?,?)",
          [nome, email, telefone, endereco, hash],
          (error, response) => {
            if (error) {
              return res.send(error);
            }
            res.send({ msg: "Usuário cadastrado com sucesso" });
          }
        );
      });
    } else {
      res.send({ msg: "Email já cadastrado" });
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM Usuario WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result && result.length > 0) {
      bcrypt.compare(password, result[0].senha, (error, response) => {
        if (error) {
          return res.send(error);
        }
        if (response) {
          res.send({ msg: "Usuário logado" });
          
        } else {
          res.send({ msg: "Senha incorreta" });
        }
      });
    } else {
      res.send({ msg: "Usuário não registrado!" });
    }
  });
});

// logica de adicionar o item no carrinho no banco de dados

app.post("/api/carrinho/adicionar", (req, res) => {
  const { idUsuario, idProduto, quantidade, precoUnitario } = req.body;

  // Verificar se o usuário já tem um carrinho
  db.query("SELECT id FROM Carrinho WHERE idUsuario = ?", [idUsuario], (err, result) => {
    if (err) return res.status(500).send(err);

    let idCarrinho;
    if (result.length === 0) {
      // Criar carrinho se não existir
      db.query("INSERT INTO Carrinho (idUsuario) VALUES (?)", [idUsuario], (err, result) => {
        if (err) return res.status(500).send(err);

        idCarrinho = result.insertId;

        // Inserir o item no carrinho
        const queryItemCarrinho = `
          INSERT INTO ItemCarrinho (idCarrinho, idProduto, quantidade)
          VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?`;
        
        db.query(queryItemCarrinho, [idCarrinho, idProduto, quantidade, quantidade], (err, result) => {
          if (err) return res.status(500).send(err);
          res.status(200).json({ message: "Produto adicionado ao carrinho!" });
        });
      });
    } else {
      // Carrinho já existe, inserir o item no carrinho
      idCarrinho = result[0].id;

      // Inserir o item no carrinho
      const queryItemCarrinho = `
        INSERT INTO ItemCarrinho (idCarrinho, idProduto, quantidade)
        VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?`;

      db.query(queryItemCarrinho, [idCarrinho, idProduto, quantidade, quantidade], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: "Produto adicionado ao carrinho!" });
      });
    }
  });
});




app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
