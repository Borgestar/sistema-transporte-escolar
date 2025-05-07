const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
// Conecta ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transporte_escolar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Cadastro = require('./models/Cadastro');

// Configura arquivos estáticos e parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão - deve vir antes do middleware isLoggedIn e das rotas
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true
}));

// Disponibiliza isLoggedIn em todas as views
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.logado);
  next();
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas públicas
app.get('/', (req, res) => {
  const sucesso = req.query.sucesso === 'true';
  res.render('index', { sucesso });
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/index', (req, res) => {
  const sucesso = req.query.sucesso === 'true';
  res.render('index', { sucesso });
});

app.get('/buscar-contrato', (req, res) => {
  res.render('buscar-contrato', { erro: null });
});

app.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

// Rotas de ação
app.post('/cadastro', async (req, res) => {
  const { responsavel, endereco, aluno, escola, telefone, mensalidade } = req.body;

  if (!responsavel || !endereco || !aluno || !escola || !telefone || !mensalidade) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    return res.status(400).send('Telefone inválido!');
  }

  const novoCadastro = new Cadastro(req.body);
  await novoCadastro.save();
  res.redirect('/index?sucesso=true');
});

app.post('/buscar-contrato', async (req, res) => {
  const { responsavel } = req.body;
  const cadastro = await Cadastro.findOne({ responsavel: new RegExp(`^${responsavel}$`, 'i') });

  if (!cadastro) {
    return res.render('buscar-contrato', { erro: 'Responsável não encontrado.' });
  }

  res.redirect(`/contrato/${cadastro._id}`);
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '1234') {
    req.session.logado = true;
    return res.redirect('/lista');
  }
  res.render('login', { erro: 'Usuário ou senha inválidos' });
});

// Middleware de proteção
function checkAuth(req, res, next) {
  if (req.session.logado) {
    return next();
  }
  res.redirect('/login');
}

// Rotas protegidas
app.get('/lista', checkAuth, async (req, res) => {
  const cadastros = await Cadastro.find();
  res.render('lista', { cadastros });
});

app.get('/contrato/:id', checkAuth, async (req, res) => {
  const cadastro = await Cadastro.findById(req.params.id);
  res.render('contrato', { cadastro });
});

app.get('/editar/:id', checkAuth, async (req, res) => {
  const cadastro = await Cadastro.findById(req.params.id);
  res.render('editar', { cadastro });
});

app.post('/editar/:id', checkAuth, async (req, res) => {
  await Cadastro.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/lista');
});

app.post('/excluir/:id', checkAuth, async (req, res) => {
  await Cadastro.findByIdAndDelete(req.params.id);
  res.redirect('/lista');
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/home`);
});
