const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require('multer');
const path = require('path');


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "SistemaVendas",
});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
          res.send({ msg: "Usuário logado", idUsuario: result[0].id });
        } else {
          res.send({ msg: "Senha incorreta" });
        }
      });
    } else {
      res.send({ msg: "Usuário não registrado!" });
    }
  });
});

// logica de adicionar carrinho no site

app.post("/api/carrinho/adicionar", (req, res) => {
  const { idUsuario, idProduto, quantidade, precoUnitario } = req.body;
  console.log("Recebendo requisição:", req.body);

  if (!idUsuario || !idProduto || !quantidade || !precoUnitario) {
    return res.status(400).json({ error: "Dados incompletos na requisição" });
  }

  const checkCarrinhoQuery = "SELECT id FROM Carrinho WHERE idUsuario = ?";
  db.query(checkCarrinhoQuery, [idUsuario], (err, result) => {
    if (err) {
      console.error("Erro ao verificar carrinho:", err);
      return res.status(500).json({ error: "Erro no banco de dados", details: err });
    }
    let carrinhoId = result.length > 0 ? result[0].id : null;
    if (!carrinhoId) {
      const createCarrinhoQuery = "INSERT INTO Carrinho (idUsuario) VALUES (?)";
      db.query(createCarrinhoQuery, [idUsuario], (errCreate, resultCreate) => {
        if (errCreate) {
          console.error("Erro ao criar carrinho:", errCreate);
          return res.status(500).json({ error: "Erro ao criar carrinho", details: errCreate });
        }
        carrinhoId = resultCreate.insertId;
        addItemCarrinho(carrinhoId);
      });
    } else {
      addItemCarrinho(carrinhoId);
    }

    function addItemCarrinho(carrinhoId) {
      const checkItemQuery = "SELECT * FROM ItemCarrinho WHERE idCarrinho = ? AND idProduto = ?";
      db.query(checkItemQuery, [carrinhoId, idProduto], (errCheckItem, resultItem) => {
        if (errCheckItem) {
          console.error("Erro ao verificar item no carrinho:", errCheckItem);
          return res.status(500).json({ error: "Erro no banco de dados", details: errCheckItem });
        }

        if (resultItem.length > 0) {
          const updateItemQuery = "UPDATE ItemCarrinho SET quantidade = quantidade + ? WHERE idCarrinho = ? AND idProduto = ?";
          db.query(updateItemQuery, [quantidade, carrinhoId, idProduto], (errUpdate, resultUpdate) => {
            if (errUpdate) {
              console.error("Erro ao atualizar item no carrinho:", errUpdate);
              return res.status(500).json({ error: "Erro ao atualizar produto no carrinho", details: errUpdate });
            }
            res.status(200).json({ message: "Produto atualizado no carrinho!" });
          });
        } else {
          const insertItemQuery = "INSERT INTO ItemCarrinho (idCarrinho, idProduto, quantidade, precoUnitario) VALUES (?, ?, ?, ?)";
          db.query(insertItemQuery, [carrinhoId, idProduto, quantidade, precoUnitario], (errInsert, resultInsert) => {
            if (errInsert) {
              console.error("Erro ao adicionar item ao carrinho:", errInsert);
              return res.status(500).json({ error: "Erro ao adicionar produto ao carrinho", details: errInsert });
            }
            res.status(200).json({ message: "Produto adicionado ao carrinho!" });
          });
        }
      });
    }
  });
});

// api do carrinho

app.get('/api/carrinho', (req, res) => {
  const { idUsuario } = req.query;

  if (!idUsuario) {
    return res.status(400).json({ error: 'idUsuario é necessário' });
  }

  const queryCarrinho = "SELECT id FROM Carrinho WHERE idUsuario = ?";
  db.query(queryCarrinho, [idUsuario], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar carrinho', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    const carrinhoId = result[0].id;
    const queryItems = `
      SELECT p.id AS idProduto, p.nome, p.preco, ic.quantidade, CONCAT('http://localhost:3001/uploads/', p.imagem) AS imagemUrl
      FROM ItemCarrinho ic
      JOIN Produto p ON ic.idProduto = p.id
      WHERE ic.idCarrinho = ?
    `;
    db.query(queryItems, [carrinhoId], (errItems, items) => {
      if (errItems) {
        return res.status(500).json({ error: 'Erro ao buscar itens do carrinho', details: errItems });
      }
      console.log(items);
      res.status(200).json(items);
    });
  });
});

// logica de remover carrinho no site

app.delete('/api/carrinho/remover', (req, res) => {
  const { idUsuario, idProduto } = req.query;

  if (!idUsuario || !idProduto) {
    return res.status(400).json({ error: 'idUsuario e idProduto são necessários' });
  }
  const queryCarrinho = "SELECT id FROM Carrinho WHERE idUsuario = ?";
  db.query(queryCarrinho, [idUsuario], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar carrinho', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }
    const carrinhoId = result[0].id;
    const queryRemove = "DELETE FROM ItemCarrinho WHERE idCarrinho = ? AND idProduto = ?";
    db.query(queryRemove, [carrinhoId, idProduto], (errRemove, resultRemove) => {
      if (errRemove) {
        return res.status(500).json({ error: 'Erro ao remover item do carrinho', details: errRemove });
      }
      
      if (resultRemove.affectedRows === 0) {
        return res.status(404).json({ error: "Produto não encontrado no carrinho" });
      }

      res.status(200).json({ message: "Produto removido do carrinho!" });
    });
  });
});

// logica de cadastro de prodtuto

app.get("/api/produtos", (req, res) => {
  const query = "SELECT * FROM Produto";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produtos", details: err });
    }
    res.status(200).json(result);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

app.post("/api/produto/cadastrar", upload.single('imagem'), (req, res) => {
  const { nome, descricao, preco, quantidadeEmEstoque, categoria } = req.body;
  const imagem = req.file ? req.file.filename : null; 

  if (!nome || !descricao || !preco || !quantidadeEmEstoque || !categoria) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const query = "INSERT INTO Produto (nome, descricao, preco, quantidadeEmEstoque, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [nome, descricao, preco, quantidadeEmEstoque, categoria, imagem], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao cadastrar produto", details: err });
    }
    res.status(201).json({ message: "Produto cadastrado com sucesso!", produtoId: result.insertId });
  });
});

// api do pagamento 

app.post("/api/pagamento", (req, res) => {
  const { idUsuario, tipo, status, idPedido } = req.body;
  
  if (!idUsuario || !tipo || !status || !idPedido) {
    return res.status(400).json({ error: "Dados incompletos para pagamento" });
  }

  const queryPagamento = "INSERT INTO Pagamento (idPedido, tipo, status, dataPagamento) VALUES (?, ?, ?, NOW())";
  db.query(queryPagamento, [idPedido, tipo, status], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao processar pagamento", details: err });
    }
    res.status(200).json({ message: "Pagamento realizado com sucesso!" });
  });
});

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
