📂 O QUE É ESSE ARQUIVO?

Ele é um mapa de botões.

Ele diz:

“Se alguém pedir X, chama a função Y.”

Ele não luta, não calcula nada. Ele só direciona o pedido.

🧱 O ARQUIVO
const express = require('express');
const router = express.Router();
const combatController = require('../controllers/combatController');

🧰 Linha 1
const express = require('express');

Pegando a ferramenta de rotas do Express.

🧭 Linha 2
const router = express.Router();

Aqui você cria um mini-servidor só para o combate.

🖼 Imagine assim:

🏢 SERVIDOR GERAL
└── ⚔️ SETOR COMBATE
└── 🚪 router

Esse router só cuida de URLs relacionadas à luta.

🧠 Linha 3
const combatController = require('../controllers/combatController');

Aqui mora o próximo nível.

O router não executa lógica.
Ele chama o controlador.

🖼

Router → Controller → Engine

🚪 AS PORTAS DE ENTRADA
router.post('/combate/iniciar', combatController.iniciarCombate);
router.post('/combate/acao', combatController.executarAcao);

Aqui estão os dois botões do sistema de combate.

🎬 1️⃣ Iniciar combate
router.post('/combate/iniciar', combatController.iniciarCombate);

Quando o frontend faz:

fetch('/api/combate/iniciar', { method: 'POST' })

O fluxo é:

🖥️ Frontend
↓
server.js ("/api")
↓
combatRoutes.js
↓
combatController.iniciarCombate()
↓
Engine cria estado inicial da luta

👉 Esse botão cria a luta.

⚔️ 2️⃣ Executar ação
router.post('/combate/acao', combatController.executarAcao);

Esse é o botão principal do jogo.

Quando o jogador aperta ENTER, escolhe golpe, etc:

fetch('/api/combate/acao', {
method: 'POST',
body: { golpe, direcao }
})

Fluxo:

👤 Jogador
↓
🖥️ ArenaCombate.jsx
↓
📡 /api/combate/acao
↓
combatRoutes.js
↓
combatController.executarAcao()
↓
Engine decide o que acontece
↓
Estado novo volta para o frontend

🧠 O QUE ESSE ARQUIVO NÃO FAZ

❌ Não calcula dano
❌ Não rola dado
❌ Não muda fase
❌ Não mexe em stamina

Ele é só um tradutor de endereço → função.

📦 Última linha
module.exports = router;

Você está dizendo:

“server.js, aqui está o setor de combate para você usar.”

Lembra lá?

app.use("/api", combatRoutes);

Então /api + /combate/acao =

/api/combate/acao

🧠 RESUMO VISUAL
🌐 REQUISIÇÃO CHEGA
↓
🏢 server.js
↓
⚔️ combatRoutes.js ← MAPA DE BOTÕES
↓
🧠 combatController ← EXECUTA
↓
⚙️ Engine

🎯 FRASE DEFINITIVA

combatRoutes.js é o painel de botões do setor de combate.
Ele não luta. Ele só decide qual função apertar.
