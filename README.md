# 🚌 Sistema de Transporte Escolar

Um sistema simples e responsivo para cadastro e gerenciamento de alunos transportados, com geração de contrato, desenvolvido com Node.js, Express e MongoDB.

## 🔧 Tecnologias Utilizadas

- Node.js + Express
- MongoDB (ou MongoDB Atlas)
- EJS (templating)
- Bootstrap (estilo responsivo)
- Dotenv (variáveis de ambiente)

## 📦 Funcionalidades

- Cadastro de responsável, aluno, escola, endereço, telefone e valor da mensalidade
- Listagem dos alunos cadastrados
- Visualização de contrato simples
- Interface web responsiva

## 🚀 Como Executar

### Pré-requisitos:

- Node.js e npm instalados
- MongoDB rodando localmente ou online (ex: Atlas)

### Passos:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sistema-transporte-escolar.git
   cd sistema-transporte-escolar
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o `.env` com sua conexão MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/transporte_escolar
   ```

4. Inicie o servidor:
   ```bash
   node server.js
   ```

5. Acesse em seu navegador:
   ```
   http://localhost:3000
   ```

## 📁 Estrutura

```
.
├── server.js
├── models/
│   └── Cadastro.js
├── views/
│   ├── index.ejs
│   ├── lista.ejs
│   └── contrato.ejs
├── public/
│   └── css/
├── .env
└── README.md
```

## ✍️ Autor

Desenvolvido por [Lucas Borges] 🚀  
Contato: [lucassborgess600@gmail.com]