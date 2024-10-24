const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  res.send({ message: "funcionando!" });
});

router.get("/node-mongodb-mongoose-user", (req, res) => {
  res.render("node");
});

router.post("/node-mongodb-mongoose-user", async (req, res) => {
  const { emailBody: email } = req.body;

  const user = new User({
    firstname: "Iago",
    lastname: "Grilly",
    password: "senha",
    email,
  });

  console.log(user);
  await user.save();
  res.redirect("/node-mongodb-mongoose-user");
});

module.exports = router;
