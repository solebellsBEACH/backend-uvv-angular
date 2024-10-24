const express = require("express"); // Importa o pacote Express
const bodyParser = require("body-parser"); // Importa o pacote body-parser para análise de corpo de requisição
const path = require("path"); // Importa o pacote path para lidar com caminhos de arquivos
const cors = require("cors"); // Importa o pacote cors para habilitar o CORS
const mongoose = require("mongoose"); // Importa o pacote mongoose para interagir com o MongoDB
const Grid = require("gridfs-stream");

const messageRoutes = require("./routes/messages"); // Importa as rotas de mensagens
const userRoutes = require("./routes/user"); // Importa as rotas de usuário

const app = express(); // Cria uma instância do aplicativo Express

// Configuração do CORS
const corsOptions = {
  origin: "http://localhost:4200", // Troque isso para a origem do seu cliente
  methods: ["GET", "PUT", "POST", "DELETE"], // Permitir apenas esses métodos
};

app.use(cors(corsOptions)); // Habilita o CORS para a origem e métodos especificados

app.get("/", (req, res, next) => {
  // Rota para a página inicial
  res.send({ message: "app.js!" });
  res.render("index"); // Renderiza a página 'index'
});

// Conexão com o MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/uvv-express-db";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso."); // Mensagem de sucesso
  })
  .catch((error) => {
    console.error("Erro na conexão com o MongoDB:", error); // Mensagem de erro
  });

// Inicializando o GridFS
let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("GridFS inicializado.");
});

app.use(bodyParser.json()); // Usa o body-parser para análise de JSON
app.use(bodyParser.urlencoded({ extended: false })); // Usa o body-parser para análise de URL codificada

app.use(express.static(path.join(__dirname, "public"))); // Define o diretório público para servir arquivos estáticos
app.use("/uploads", express.static("uploads"));

app.use("/message", messageRoutes); // Define as rotas para mensagens
app.use("/user", userRoutes); // Define as rotas para usuários

module.exports = app; // Exporta o aplicativo Express para uso em outros arquivos do Node.js
