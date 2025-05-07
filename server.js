const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transporte_escolar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Cadastro = require('./models/Cadastro');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


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

app.post('/cadastro', async (req, res) => {
  const { responsavel, endereco, aluno, escola, telefone, mensalidade } = req.body;

  // Verificação simples
  if (!responsavel || !endereco || !aluno || !escola || !telefone || !mensalidade) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    return res.status(400).send('Telefone inválido!');
  }

  const novoCadastro = new Cadastro(req.body);
  await novoCadastro.save();
  res.redirect('/?sucesso=true');
});

const session = require('express-session');
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true
}));


app.get('/buscar-contrato', (req, res) => {
  res.render('buscar-contrato', { erro: null });
});

app.get('/lista', async (req, res) => {
  if (!req.session.logado) {
    return res.redirect('/login');
  }

  const cadastros = await Cadastro.find();
  res.render('lista', { cadastros });
});


app.get('/contrato/:id', async (req, res) => {
  const cadastro = await Cadastro.findById(req.params.id);
  res.render('contrato', { cadastro });
});

app.get('/editar/:id', async (req, res) => {
  const cadastro = await Cadastro.findById(req.params.id);
  res.render('editar', { cadastro });
});

app.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '1234') {
    req.session.logado = true;
    res.redirect('/lista');
  } else {
    res.render('login', { erro: 'Usuário ou senha inválidos' });
  }
});

app.post('/editar/:id', async (req, res) => {
  await Cadastro.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/lista');
});

app.post('/excluir/:id', async (req, res) => {
  try {
    await Cadastro.findByIdAndDelete(req.params.id);
    res.redirect('/lista');
  } catch (err) {
    res.status(500).send('Erro ao excluir cadastro.');
  }
});

app.post('/buscar-contrato', async (req, res) => {
  const { responsavel } = req.body;
  const cadastro = await Cadastro.findOne({ responsavel: new RegExp(`^${responsavel}$`, 'i') });

  if (!cadastro) {
    return res.render('buscar-contrato', { erro: 'Responsável não encontrado.' });
  }

  res.redirect(`/contrato/${cadastro._id}`);
});

app.set('views', path.join(__dirname, 'views'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/home`);
});