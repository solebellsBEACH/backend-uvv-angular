const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");

router.get("/", (req, res) => {
  res.send({ message: "message.js!" });
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    const message = new Message({
      user: req.body.user,
      content: req.body.content,
      username: `${user.firstName} ${user.lastName}`,
      imageURL: user.imageURL,
    });

    const savedMessage = await message.save();
    res.status(201).json({
      success: "Mensagem salva com sucesso",
      message: savedMessage,
    });
  } catch (err) {
    res.status(500).json({
      errorTitle: "Erro ao salvar a mensagem",
      error: err,
    });
  }
});

router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Message.find({}).populate("user", "firstName lastName imageURL");
    res.status(200).json({
      success: "Mensagens recuperadas com sucesso",
      messages,
    });
  } catch (err) {
    res.status(500).json({
      errorTitle: "Erro ao buscar as mensagens",
      error: err,
    });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const message = await Message.findById(req.params._id);
    if (!message) {
      return res.status(404).json({
        errorTitle: "Mensagem não encontrada",
        error: "A mensagem com o ID fornecido não foi encontrada.",
      });
    }

    await Message.findByIdAndDelete(req.params._id);
    res.status(200).json({ success: "Mensagem excluída com sucesso" });
  } catch (err) {
    res.status(500).json({
      errorTitle: "Erro ao excluir a mensagem",
      error: err,
    });
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const message = await Message.findById(req.params._id);
    if (!message) {
      return res.status(404).json({
        errorTitle: "Mensagem não encontrada",
        error: "A mensagem com o ID fornecido não foi encontrada.",
      });
    }

    const updatedMessage = await Message.findByIdAndUpdate(req.params._id, { content: req.body.content }, { new: true });
    res.status(200).json({
      success: "Mensagem atualizada com sucesso",
      updatedMessage,
    });
  } catch (err) {
    res.status(500).json({
      errorTitle: "Erro ao atualizar a mensagem",
      error: err,
    });
  }
});

module.exports = router;
