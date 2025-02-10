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

app.post("/api/carrinho/adicionar", async (req, res) => {
  try {
    const { idUsuario, idProduto, quantidade, precoUnitario } = req.body;

    console.log("Recebendo requisição:", req.body);

    if (!idUsuario || !idProduto || !quantidade || !precoUnitario) {
      return res.status(400).json({ error: "Dados incompletos na requisição" });
    }

    // Verificar se o produto já está no carrinho
    const checkQuery = "SELECT * FROM Carrinho WHERE idUsuario = ? AND idProduto = ?";
    db.query(checkQuery, [idUsuario, idProduto], (err, result) => {
      if (err) {
        console.error("Erro ao verificar produto no carrinho:", err);
        return res.status(500).json({ error: "Erro no banco de dados", details: err });
      }

      if (result.length > 0) {
        // Produto já está no carrinho, podemos atualizar a quantidade
        const updateQuery = "UPDATE Carrinho SET quantidade = quantidade + ? WHERE idUsuario = ? AND idProduto = ?";
        db.query(updateQuery, [quantidade, idUsuario, idProduto], (err, result) => {
          if (err) {
            console.error("Erro ao atualizar carrinho:", err);
            return res.status(500).json({ error: "Erro no banco de dados", details: err });
          }
          res.status(200).json({ message: "Produto atualizado no carrinho!" });
        });
      } else {
        // Produto não existe no carrinho, então adicionamos
        const query = "INSERT INTO Carrinho (idUsuario, idProduto, quantidade, precoUnitario) VALUES (?, ?, ?, ?)";
        db.query(query, [idUsuario, idProduto, quantidade, precoUnitario], (err, result) => {
          if (err) {
            console.error("Erro ao adicionar item ao carrinho:", err);
            return res.status(500).json({ error: "Erro no banco de dados", details: err });
          }
          res.status(200).json({ message: "Produto adicionado ao carrinho!" });
        });
      }
    });
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get('/api/carrinho', (req, res) => {
  const { idUsuario } = req.query;

  if (!idUsuario) {
    return res.status(400).json({ error: 'idUsuario é necessário' });
  }

  const queryCarrinho = `
    SELECT id FROM Carrinho WHERE idUsuario = ?
  `;

  db.query(queryCarrinho, [idUsuario], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar carrinho' });
    }

    if (result.length === 0) {
      // Caso não exista o carrinho para o usuário, cria um novo
      const queryCreateCarrinho = `
        INSERT INTO Carrinho (idUsuario) VALUES (?)
      `;
      db.query(queryCreateCarrinho, [idUsuario], (errCreate, resultCreate) => {
        if (errCreate) {
          return res.status(500).json({ error: 'Erro ao criar carrinho' });
        }

        // Após criar o carrinho, podemos buscar os itens
        const queryItems = `
          SELECT p.id AS idProduto, p.nome, p.preco, ic.quantidade
          FROM ItemCarrinho ic
          JOIN Produto p ON ic.idProduto = p.id
          WHERE ic.idCarrinho = ?
        `;
        db.query(queryItems, [resultCreate.insertId], (errItems, items) => {
          if (errItems) {
            return res.status(500).json({ error: 'Erro ao buscar itens do carrinho' });
          }
          res.json(items);
        });
      });
    } else {
      const queryItems = `
        SELECT p.id AS idProduto, p.nome, p.preco, ic.quantidade
        FROM ItemCarrinho ic
        JOIN Produto p ON ic.idProduto = p.id
        WHERE ic.idCarrinho = ?
      `;
      db.query(queryItems, [result[0].id], (errItems, items) => {
        if (errItems) {
          return res.status(500).json({ error: 'Erro ao buscar itens do carrinho' });
        }
        res.json(items);
      });
    }
  });
});


app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
