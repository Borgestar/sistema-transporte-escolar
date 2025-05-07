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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { sucesso: req.query.sucesso });
});


app.post('/cadastro', async (req, res) => {
  const novoCadastro = new Cadastro(req.body);
  await novoCadastro.save();
  res.redirect('/?sucesso=1');
});


app.get('/lista', async (req, res) => {
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});