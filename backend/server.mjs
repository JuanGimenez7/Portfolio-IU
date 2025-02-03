// Importar módulos necesarios
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// Crear una instancia de Express
const app = express();

// Configurar el puerto
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/portfolioDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un modelo de usuario (ejemplo)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Ruta de ejemplo para crear un usuario
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("Usuario registrado");
  } catch (error) {
    res.status(400).send("Error al registrar el usuario");
  }
});

// Ruta de ejemplo para obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
