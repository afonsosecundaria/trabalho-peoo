import './App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from "yup";
import Axios from "axios";

function App() {
  
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const cadastrarnodb = (values) => {
    Axios.post("http://localhost:3001/cadastro", {
      nome: values.nome,
      email: values.email,
      password: values.password,
      endereco: values.endereco,
      telefone: values.telefone

    }).then((response) => {
      alert(response.data.msg);
      console.log(response);
    });
  };

  const logarnodb = (values) =>{
    Axios.post("http://localhost:3001/login", {
      email: values.email,
      password: values.password,
    }).then((response) => {
      alert(response.data.msg)
      if(response.data.msg === "Usuário logado"){
        navigate('/home');
      }
      console.log(response);
    });
  };

  const validationcadastro = yup.object().shape({
    nome: yup.
    string().required("Este campo é obrigatório"),
    email: yup.
    string().email("Não é um email").required("Este campo é obrigatório"),
    endereco: yup.
    string().min(8, "O CEP deve ter no mínimo 8 caracteres" ).required("Este campo é obrigatório"),
    telefone: yup. 
    string().matches(/^\d{10,11}$/, "O Telefone deve ter no mínimo 10 ou 11 caracteres numéricos.").required("Este campo é obrigatório"),
    password: yup.
    string().min(8, "A senha deve ter no mínimo 8 caracteres").required("Este campo é obrigatório"),
    confirmpassword: yup.
    string().oneOf([yup.ref("password"), null], "As senhas não são iguais"),
  })

  const validationlogin = yup.object().shape({
    email: yup.
    string().email("Não é um email").required("Este campo é obrigatório"),
    password: yup.
    string().min(8, "A senha deve ter no mínimo 8 caracteres").required("Este campo é obrigatório"),
  });

  return (
    <div className='container'>
      {isLogin ? (
      <div className="login-form" id="login-form">
        <h2>Login</h2>
        <Formik 
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={logarnodb} 
        validationSchema={validationlogin}>
          <Form className='login-form-inner' id="login-form-inner"> 

            <div className="form-group">
              <label for="login-username">E-mail:</label>
              <Field type="email" id="login-username" name="email" required/>
              <ErrorMessage component="span" name='email'
              className='form-error'
              />
            </div>  

            <div className="form-group">
              <label for="login-password">Senha:</label>
              <Field type="password" id="login-password" name="password" required/>
              <ErrorMessage component="span"name='password'
              className='form-error'/>
            </div>

            <button type="submit">Entrar</button>

            <div class="login-link">
              <a onClick={() => setIsLogin(false)}>Não tem uma conta? Cadastre-se aqui</a>
            </div>
          
          </Form>
        </Formik>
        </div>
      ):(
        <div className="signup-form" id="signup-form">
            <Formik 
            initialValues={{
              nome: "",
              email: "",
              endereco: "",
              telefone: "",
              password: "",
              confirmpassword: "",
            }}
            onSubmit={cadastrarnodb}
            validationSchema={validationcadastro}>

              <Form className='signup-form-inner' id="signup-form-inner">
              <h2>Cadastre-se</h2>
                <div class="form-group">
                  <label for="signup-first-name">Nome:</label>
                  <Field type="text" id="signup-first-name" name="nome" required/>
                  <ErrorMessage component="span"name='nome'
                  className='form-error'/>
                </div>

                <div className="form-group">
                  <label for="signup-email">E-mail:</label>
                  <Field type="email" id="signup-email" name="email" required/>
                  <ErrorMessage component="span"name='email'
                  className='form-error'/>
                </div>

                <div className="form-group">
                  <label for="signup-tel">Telefone</label>
                  <Field type="text" id="signup-tel" name="telefone" required/>
                  <ErrorMessage component="span"name='telefone'
                  className='form-error'/>
                </div>

                <div className="form-group">
                  <label for="signup-cep">Endereço</label>
                  <Field type="text" id="signup-cep" name="endereco" required/>
                  <ErrorMessage component="span"name='endereco'
                  className='form-error'/>
                </div>

                <div className="form-group">
                  <label for="signup-password">Senha:</label>
                  <Field type="password" id="signup-password" name="password" required/>
                  <ErrorMessage component="span" name='password'
                  className='form-error'/>
                </div>
              
                <div className="form-group">
                  <label for="signup-confirm-password">Confirmar Senha:</label>
                  <Field type="password" id="signup-confirm-password" name="confirmpassword" required/>
                  <ErrorMessage component="span"name='confirmpassword'
                  className='form-error'/>
                </div>

                <button type="submit">Cadastrar</button>

                <div class="login-link">
                  <a onClick={() => setIsLogin(true)}>Já tem uma conta? Faça login aqui.</a>
                </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  )
}

export default App;