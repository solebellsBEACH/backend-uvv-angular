const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.originalname}-${Date.now()}${fileExtension}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

const createToken = (user) => {
  const payload = { user_id: user._id };
  return jwt.sign(payload, "frase secreta", { expiresIn: "1h" });
};

router.get("/", (req, res) => {
  res.send({ message: "user.js!" });
  res.render("index");
});

router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, email, password, country, gender, acceptTerms } = req.body;

    if (!firstName || !lastName || !email || !password || !country || !gender || !req.file) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
      gender,
      acceptTerms,
      imageURL: `http://localhost:3000/uploads/${req.file.filename}`,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = createToken(user);
    res.json({ success: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAll", async (req, res, next) => {
  try {
    const users = await User.find({}).exec();
    if (!users) {
      return res.status(404).json({ error: "Nenhum usuário encontrado" });
    }
    res.send({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
