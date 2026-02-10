👤 Jogador
   ↓
🌐 Internet
   ↓
🚪 server.js  ← PORTEIRO
   ↓
🧠 Engine / Regras / Banco

1️⃣ Chamando as ferramentas
const express = require("express");
const app = express();
const cors = require("cors");

🔍 O que isso significa?

Você está pegando caixas de ferramentas prontas.

Nome	Função
express	Construir o servidor web
app	Seu servidor em si
cors	Permitir que o frontend fale com o backend

🖼 Imagine assim:

🧰 express = kit de montar servidor
🏢 app = o prédio que você montou
🚦 cors = porteiro que deixa outros domínios entrarem

2️⃣ Configurando o prédio
app.use(cors());
app.use(express.json());

Aqui você diz ao servidor:

🟢 “Aceite visitas de fora”
🟢 “Entenda mensagens em formato JSON”

📦 JSON é o idioma que frontend e backend usam para conversar.

🖥️ Frontend manda:
{ golpe: "corte", direcao: "alto" }

📡 Servidor entende porque express.json() está ativo

3️⃣ Conectando as salas do prédio
const personagensRoutes = require("./routes/personagensRoutes");
const mesasRoutes = require("./routes/mesasRoutes");
const mesaPersonagensRoutes = require("./routes/mesaPersonagensRoutes");
const combatRoutes = require("./routes/combatRoutes");


Você está dizendo:

“Servidor, essas pastas aqui são setores diferentes do sistema.”

🖼 Visual:

🏢 SERVIDOR
 ├── 🧍 personagens
 ├── 🎲 mesas
 ├── 👥 mesa-personagens
 └── ⚔️ combate


Cada um é um conjunto de regras de rota.

4️⃣ Ligando cada sala a um endereço
app.use("/personagens", personagensRoutes);
app.use("/mesas", mesasRoutes);
app.use("/mesa-personagens", mesaPersonagensRoutes);
app.use("/api", combatRoutes);


Isso aqui é MUITO importante.

Você está criando portas de entrada.

URL	Vai para
/personagens	controle de personagens
/mesas	mesas de jogo
/mesa-personagens	vínculo personagem ↔ mesa
/api	⚔️ SISTEMA DE COMBATE

🖼 Fluxo real:

🖥️ Frontend chama:
fetch("/api/combate/acao")

↓ passa por

server.js

↓ redireciona para

routes/combatRoutes.js

↓ que chama o engine


👉 Esse arquivo não sabe regra de combate.
Ele só manda a pessoa para a sala certa.

5️⃣ Porta principal do prédio
app.get("/", (req, res) => {
  res.json({ mensagem: "Servidor RPG funcionando!" });
});


Se alguém acessar só:

http://localhost:3000


O servidor responde:

“Servidor RPG funcionando!”

É tipo a recepção dizendo:

🏢 “Sim, estamos abertos.”

6️⃣ Ligando o servidor
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


Aqui você liga o prédio.

📌 Porta 3000 = número da porta do prédio
📌 "0.0.0.0" = aceitar conexões de qualquer IP

🖼

🟢 Servidor ON
🌐 O mundo pode bater na porta 3000

