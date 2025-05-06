const mongoose = require('mongoose');

const CadastroSchema = new mongoose.Schema({
  responsavel: String,
  endereco: String,
  aluno: String,
  escola: String,
  telefone: String,
  mensalidade: String
});

module.exports = mongoose.model('Cadastro', CadastroSchema);