🧠 O QUE É O combatController?

Ele é o intermediário entre HTTP e o sistema de combate.

🌐 Internet (HTTP)
↓
🎧 Controller (escuta, organiza)
↓
🧠 Service (executa regras)

Ele não sabe regra de dano, não conhece stamina, não decide vitória.
Ele só traduz a linguagem da web para a linguagem do jogo.

📂 LINHA POR LINHA
const combatService = require('../services/combatService');

Aqui você chama a camada de serviço.

🖼 Pense assim:

Controller → Service → Engine

Controller fala:

"Service, resolve isso aqui pra mim"

🟢 FUNÇÃO 1 — INICIAR COMBATE
async function iniciarCombate(req, res) {

🔍 O que é isso?

Função que responde quando alguém chama:

POST /api/combate/iniciar

🧾 req e res
Nome O que é
req pedido que chegou
res resposta que vai voltar
🪵 Log no terminal
console.log('>>> /api/combate/acao', req.method, req.body);

Isso imprime no terminal:

> > > /api/combate/acao POST { atacanteId: 1, defensorId: 2 }

Serve só para você enxergar o que está chegando.

🧠 Chamando o Service
const combate = await combatService.iniciarCombate(req.body);

Aqui o controller diz:

"Service, pega esses dados e cria um combate"

Ele passa:

req.body = { atacanteId: 1, defensorId: 2 }

O service:

cria o estado inicial

define fase

monta log

prepara engine

E devolve o combate pronto.

📤 Resposta para o frontend
res.json(combate);

Isso manda o estado do combate de volta.

🧠 Engine criou estado
📡 Controller envia
🖥️ Frontend recebe

❌ Tratamento de erro
catch (e) {
res.status(400).json({ erro: e.message });
}

Se algo deu errado:

res.status(400)

400 = erro do cliente (dados errados, por exemplo).

⚔️ FUNÇÃO 2 — EXECUTAR AÇÃO
async function executarAcao(req, res)

Essa é chamada quando o jogador faz algo no combate.

POST /api/combate/acao

🧩 Separando os dados
const { combateId, ...payload } = req.body;

Se o frontend mandou:

{
combateId: 7,
golpe: "corte",
direcao: "alto"
}

Você separa:

variável valor
combateId 7
payload { golpe: "corte", direcao: "alto" }
🧠 Chamando o Service de novo
const combate = await combatService.executarAcao(combateId, payload);

O controller fala:

“Service, aplica essa ação nesse combate”

O service:

pega o estado na memória

chama o engine

engine muda fase, calcula, etc.

devolve novo estado

📤 Mandando resultado
res.json(combate);

Frontend recebe o combate atualizado.

🧠 O PAPEL DO CONTROLLER NO SISTEMA

Ele é um tradutor de protocolo.

Mundo Web Mundo do Jogo
HTTP Funções JS
JSON Objetos
Status 400 Erro do sistema
🖼 VISÃO GERAL
👤 Jogador aperta tecla
↓
🖥️ Frontend envia POST
↓
⚔️ Route
↓
🎧 Controller
↓
🧠 Service
↓
⚙️ Engine
↓
🎧 Controller
↓
🖥️ Frontend recebe estado novo

🎯 FRASE DEFINITIVA

O controller é o intérprete entre o idioma da internet (HTTP) e o idioma do jogo (funções internas).

🍽️ O RESTAURANTE DO SEU RPG
👤 Cliente (Jogador / Frontend)
↓
🧑‍🍳 Cozinha (Engine + Service)
↑
🤵 Garçom (Controller)

🤵 O QUE O GARÇOM FAZ?

Ele:

✔️ Escuta o pedido
✔️ Anota corretamente
✔️ Leva para a cozinha
✔️ Traz o prato pronto
❌ Não cozinha
❌ Não decide receita
❌ Não cria ingredientes
