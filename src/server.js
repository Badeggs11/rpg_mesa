const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const personagensRoutes = require("./routes/personagensRoutes");
const mesasRoutes = require("./routes/mesasRoutes");
app.use("/personagens", personagensRoutes);
app.use("/mesas", mesasRoutes);
app.get("/", (req, res) => {
    res.json({ mensagem: "Servidor RPG funcionando!"});

});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});