var express = require("express"); // Importa o pacote Express
var router = express.Router(); // Cria um objeto de roteamento do Express
const User = require("../models/user"); // Importa o modelo de usuário
const Message = require("../models/message"); // Importa o modelo de mensagem

router.get("/", (req, res, next) => {
  // Rota para a página inicial
  res.send({ message: "message.js!" });
});

// Rota para adicionar uma mensagem
router.post("/", async function (req, res, next) {
  const usersEncontrados = await User.findById(req.body.user);

  console.log(usersEncontrados);

  const messageObject = new Message({
    user: req.body.user,
    content: req.body.content,
    username: usersEncontrados.firstName + " " + usersEncontrados.lastName, // Obtém o conteúdo da mensagem do corpo da requisição
    imageURL: usersEncontrados.imageURL,
  });
  try {
    const messageSave = await messageObject.save(); // Salva a mensagem no banco de dados
    console.log(messageSave);

    res.status(201).json({
      myMsgSucesso: "Mensagem salva com sucesso", // Mensagem de sucesso
      objMessageSave: messageSave, // Objeto de mensagem salvo
    });
  } catch (err) {
    return res.status(500).json({
      myErrorTitle: "Serve-Side: Um erro aconteceu ao salvar a mensagem", // Título do erro
      myError: err, // Mensagem de erro
    });
  }
});

// Rota para recuperar todas as mensagens
router.get("/getMessages", async function (req, res, next) {
  try {
    const messageFindTodos = await Message.find({}).populate(
      "user",
      "firstName lastName imageURL"
    ); // Popula os dados do usuário, incluindo a URL da imagem

    console.log(messageFindTodos);

    res.status(200).json({
      myMsgSucesso: "Mensagem recuperada com sucesso!", // Mensagem de sucesso
      objSMessageSRecuperadoS: messageFindTodos, // Objetos de mensagens recuperadas
    });
  } catch (err) {
    return res.status(500).json({
      myErrorTitle: "Server-Side: Um erro aconteceu ao buscar as MensagenS", // Título do erro
      myError: err, // Mensagem de erro
    });
  }
});

// Rota para deletar uma mensagem
router.delete("/:_id", async function (req, res, next) {
  const messageId = req.params._id; // Obtém o ID da mensagem a ser excluída
  console.log("ID da mensagem a ser excluída:", messageId);

  // Verifica se a mensagem existe antes de tentar excluí-la
  const message = await Message.findById(messageId);
  if (!message) {
    console.error("Mensagem não encontrada para o ID fornecido:", messageId);
    return res.status(404).json({
      myErrorTitle: "Server-Side: Mensagem não encontrada", // Título do erro
      myError: "A mensagem com o ID fornecido não foi encontrada.", // Mensagem de erro
    });
  }

  try {
    await Message.findByIdAndDelete(messageId); // Exclui a mensagem do banco de dados
    console.log("Mensagem excluída com sucesso no banco de dados");
    res.status(200).json({
      myMsgSucesso: "Mensagem excluída com sucesso no banco de dados",
    }); // Mensagem de sucesso
  } catch (err) {
    console.error("Erro ao excluir a mensagem no banco de dados:", err);
    return res.status(500).json({
      myErrorTitle:
        "Server-Side: Um erro aconteceu ao excluir a mensagem no banco de dados", // Título do erro
      myError: err, // Mensagem de erro
    });
  }
});

// Rota para atualizar uma mensagem
router.put("/:_id", async function (req, res, next) {
  const messageId = req.params._id; // Obtém o ID da mensagem a ser atualizada
  console.log("ID da mensagem a ser atualizada:", messageId);

  // Verifica se a mensagem existe antes de tentar atualizá-la
  const message = await Message.findById(messageId);
  if (!message) {
    console.error("Mensagem não encontrada para o ID fornecido:", messageId);
    return res.status(404).json({
      myErrorTitle: "Server-Side: Mensagem não encontrada", // Título do erro
      myError: "A mensagem com o ID fornecido não foi encontrada.", // Mensagem de erro
    });
  }

  try {
    // Atualiza a mensagem com os novos dados fornecidos no corpo da solicitação
    console.log("Novo Conteudo:", req.body.content);
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: req.body.content },
      { new: true }
    );
    console.log("Mensagem atualizada com sucesso:", updatedMessage);
    res.status(200).json({
      myMsgSucesso: "Mensagem atualizada com sucesso",
      updatedMessage,
    }); // Mensagem de sucesso
  } catch (err) {
    console.error("Erro ao atualizar a mensagem no banco de dados:", err);
    return res.status(500).json({
      myErrorTitle:
        "Server-Side: Um erro aconteceu ao atualizar a mensagem no banco de dados", // Título do erro
      myError: err, // Mensagem de erro
    });
  }
});

module.exports = router; // Exporta o roteador para uso em outros arquivos do Node.js
