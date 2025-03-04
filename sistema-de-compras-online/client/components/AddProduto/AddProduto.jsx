import React, { useState } from 'react';
import './AddProduto.css';
import Axios from "axios";
import { useNavigate } from 'react-router-dom';

const AddProduto = () => {
    const navigate = useNavigate();
    const [produto, setProduto] = useState({
        nome: "",
        descricao: "",
        preco: "",
        quantidadeEmEstoque: "",
        categoria: "",
        imagem: null,
    });
    const handleChange = (e) => {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        setProduto({ ...produto, imagem: e.target.files[0] });
    };
    const cadastrar = async (e) => {
        e.preventDefault();
        console.log(produto);
        if (!produto.nome || !produto.descricao || !produto.preco || !produto.quantidadeEmEstoque || !produto.categoria) {
            alert("Todos os campos são obrigatórios");
            return;
        }
        const formData = new FormData();
        formData.append("nome", produto.nome);
        formData.append("descricao", produto.descricao);
        formData.append("preco", produto.preco);
        formData.append("quantidadeEmEstoque", produto.quantidadeEmEstoque);
        formData.append("categoria", produto.categoria);
        if (produto.imagem) {
            formData.append("imagem", produto.imagem);
        }
        try {
            const response = await Axios.post("http://localhost:3001/api/produto/cadastrar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 201) {
                alert("Produto cadastrado com sucesso!");
                navigate("/home");
        }
            } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            alert("Erro ao cadastrar produto");
          }
    };

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
        <main>
            <h2>Adicionar Produto</h2>
            <div className="formulario">
                <h3>Detalhes do Pagamento</h3>
                <input type="text" name="nome" placeholder="Nome do Produto" onChange={handleChange} />
                <input type="text" name="descricao" placeholder="Descrição" onChange={handleChange} />
                <input type="number" name="preco" placeholder="Preço" onChange={handleChange} />
                <input type="number" name="quantidadeEmEstoque" placeholder="Quantidade em Estoque" onChange={handleChange} />
                <input type="text" name="categoria" placeholder="Categoria" onChange={handleChange} />
                <input type="file" name="imagem" onChange={handleFileChange} />
                <button onClick={cadastrar}>Cadastrar Produto</button>
                <button onClick={() => navigate("/home")}>Voltar</button>
            </div>
        </main>
        <footer>&copy; 2025 deChinelo, todos os direitos reservados.</footer>
    </div>
  );
};

export default AddProduto;
