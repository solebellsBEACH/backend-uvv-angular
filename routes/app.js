var express = require("express"); // Importa o pacote Express
var router = express.Router(); // Cria um objeto de roteamento do Express
var User = require("../models/user"); // Importa o modelo de usuário

router.get("/", (req, res, next) => {
  // Rota para a página inicial
  res.send({ message: "funcionando!" });
  //   res.render("index"); // Renderiza a página 'index'
});

router.get("/node-mongodb-mongoose-user", (req, res, next) => {
  // Rota para a página 'node'
  res.render("node"); // Renderiza a página 'node'
});

router.post("/node-mongodb-moongose-user", async (req, res, next) => {
  // Rota para lidar com o envio de dados do formulário de usuário
  var emailVar = req.body.emailBody; // Obtém o email do corpo da requisição
  var userObject = new User({
    // Cria um novo objeto de usuário com os dados fornecidos
    firstname: "Iago",
    lastname: "Grilly",
    password: "senha",
    email: emailVar,
  });
  await userObject.save(); // Salva o objeto de usuário no banco de dados

  res.redirect("/node-mongodb-mongoose-user"); // Redireciona para a página 'node'
});

module.exports = router; // Exporta o roteador para uso em outros arquivos do Node.js
