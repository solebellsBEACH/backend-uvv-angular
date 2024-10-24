const express = require("express"); // Importa o pacote Express
const router = express.Router(); // Cria um objeto de roteamento do Express
const bcrypt = require("bcryptjs"); // Importa o pacote bcrypt para hash de senha
const jwt = require("jsonwebtoken"); // Importa o pacote jsonwebtoken para autenticação JWT
const multer = require("multer");
const path = require("path");

const User = require("../models/user"); // Importa o modelo de usuário

router.get("/", (req, res, next) => {
  // Rota para a página inicial
  res.send({ message: "user.js!" });
  res.render("index"); // Renderiza a página 'index'
});

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split("/");
    const fileType = mimeType[1];
    const fileName = file.originalname + "." + fileType;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Rota para registrar um novo usuário
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    console.log("Recebida requisição para registrar um novo usuário");
    console.log(req.body); // Dados do formulário
    console.log(req.file); // Dados do arquivo

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.country ||
      !req.body.gender ||
      !req.file // Verifica se o arquivo foi enviado
    ) {
      console.error("Campos obrigatórios ausentes"); // Mensagem de erro
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 12); // Hash da senha

    // Criar um novo usuário
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      gender: req.body.gender,
      acceptTerms: req.body.acceptTerms,
      imageURL: "http://localhost:3000/uploads/" + req.file.filename, // Salva o caminho do arquivo
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para fazer login
router.post("/signin", async (req, res) => {
  try {
    console.log("Recebida requisição para fazer login"); // Mensagem de login
    console.log(req.body); // Exibe os dados recebidos no corpo da requisição

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!req.body.email || !req.body.password) {
      console.error("Campos obrigatórios ausentes: Email ou senha"); // Mensagem de erro
      return res.status(400).json({ error: "Email e senha são obrigatórios" }); // Responde com um erro
    }

    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.error("Usuário não encontrado:", req.body.email); // Mensagem de erro
      return res.status(404).json({ error: "Usuário não encontrado" }); // Responde com um erro
    }

    // Comparar a senha fornecida com a senha hashada no banco de dados
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      console.error("Senha incorreta para o usuário:", user.email); // Mensagem de erro
      return res.status(401).json({ error: "Senha incorreta" }); // Responde com um erro
    }

    // Criar e enviar o token de autenticação
    const token = createToken(user); // Cria o token JWT
    console.log("Login bem-sucedido para o usuário:", user.email); // Mensagem de sucesso
    res.json({ success: "Login bem-sucedido", token: token }); // Responde com o token
  } catch (error) {
    console.error("Erro ao fazer login:", error.message); // Mensagem de erro
    res.status(500).json({ error: error.message }); // Responde com um erro
  }
});

// Função para criar o token JWT
function createToken(user) {
  const payload = {
    user_id: user._id,
  };
  return jwt.sign(payload, "frase secreta", { expiresIn: "1h" }); // Retorna o token assinado com tempo de expiração
}

router.get("/getAll", async (req, res, next) => {
  try {
    const usersEncontrados = await User.find({}).exec(); // Encontra todos os usuários no banco de dados
    if (!usersEncontrados) {
      const err = new Error("Nenhum usuário encontrado"); // Mensagem de erro
      err.status = 404; // Define o status do erro
      return next(err); // Passa o erro para o próximo middleware
    }
    res.send({ users: usersEncontrados });
  } catch (err) {
    console.error(err); // Mensagem de erro
    next(err); // Passa o erro para o próximo middleware
  }
});

module.exports = router; // Exporta o roteador para uso em outros arquivos do Node.js
