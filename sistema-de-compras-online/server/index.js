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

app.post("/cadastro", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const telefone = req.body.telefone;
  const password = req.body.senha;


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
          "INSERT INTO Usuario (nome, email, telefone, endereco, password) VALUES (?,?,?,?,?)",
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
      bcrypt.compare(password, result[0].password, (error, response) => {
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

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
