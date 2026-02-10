🍳 combatService.js (a cozinha que coordena a luta)

Pensa nele como o Chefe de Cozinha do Combate:

Ele pega o pedido (ação do jogador/CPU)

Confere se a luta existe e se pode continuar

Chama o Fogão (Engine) para “cozinhar” as regras

Se o próximo a agir é CPU, ele chama o robô cozinheiro (IA) e continua

Se entrar numa fase que precisa de “show” (dado/animação/tempo), ele para e devolve o estado pra tela

📌 “Imagem mental” do fluxo:

🖥️ Frontend (pedido)
     │
     ▼
🤵 Controller (anota)
     │
     ▼
🍳 combatService (coordena a cozinha)
     │
     ├── 🗃️ combatStore (geladeira: guarda lutas em memória)
     ├── 🧍 personagensService (despensa: pega personagens do banco)
     ├── ⚙️ engine/combateTurnos (fogão: aplica regras)
     └── 🤖 decidirAcaoCpu (robô: escolhe jogada da CPU)

🧩 Lista de funções e tradução para português

Vou listar as funções que aparecem no seu arquivo, com:

Nome no código

Ação em português (o verbo real)

De onde vem (arquivo/import)

O que significa na história do sistema

1) obterCombate(combateId)

✅ Português: “pegar o combate guardado (pelo id)”

📍 Vem de: ./combatStore

const { obterCombate, removerCombate } = require('./combatStore');


📌 Onde fica o código: services/combatStore.js (ou combatStore.js na pasta services)

🖼️ Significado:

🗃️ combatStore = prateleira de lutas ativas
      ├─ [id=abc] Combate do Jake vs Goblin
      └─ [id=def] Combate da Rebeca vs Orc 😄


Ele faz algo como: “procura no armazenamento em memória e devolve o objeto combate”.

2) removerCombate(combateId)

✅ Português: “apagar a luta da memória”

📍 Vem de: ./combatStore
📌 Onde fica: services/combatStore.js

🖼️ Significado:

🏁 combate finalizado
     │
     ▼
🧹 removerCombate = tirar da prateleira


Isso evita acumular lutas velhas na RAM.

3) executarTurno(combate, payload)

✅ Português: “rodar a próxima etapa da luta (usando essa ação)”

📍 Vem de: ../game/engine/combateTurnos

const { executarTurno } = require('../game/engine/combateTurnos');


📌 Onde fica: game/engine/combateTurnos.js

🖼️ Significado:

🎛️ você entrega:
   - o ESTADO (combate)
   - a INTENÇÃO (payload)

⚙️ o engine devolve:
   - o estado atualizado (mudou fase, logs, dano, stamina...)


Esse é o “motor” que move o combate de fase em fase.

4) criarEstadoInicial(atacante, defensor)

✅ Português: “montar a ficha inicial da luta”

📍 Vem de: ../game/engine/combateTurnos

const { criarEstadoInicial } = require('../game/engine/combateTurnos');


📌 Onde fica: game/engine/combateTurnos.js

🖼️ Significado:

🧬 criaEstadoInicial = “nascer o combate”

👤 Jake + 👹 Goblin
      │
      ▼
📦 estado inicial:
   fase, turno, personagens, vida, stamina, log vazio, etc.

5) criarCombate(combate)

✅ Português: “guardar essa luta nova na memória”

📍 Vem de: ./combatStore

const { criarCombate } = require('./combatStore');


📌 Onde fica: services/combatStore.js

🖼️ Significado:

🆕 combate criado
   │
   ▼
🗃️ criarCombate = colocar na prateleira

6) personagensService.buscarPorId(id)

✅ Português: “buscar personagem no banco pelo id”

📍 Vem de: ./personagensService

const personagensService = require('./personagensService');


📌 Onde fica: services/personagensService.js

🖼️ Significado:

🗄️ SQLite (banco)
   │
   ▼
🧍 buscarPorId = “me dá a ficha do personagem”

7) decidirAcaoCpu(combate)

✅ Português: “CPU escolher a jogada (com base no estado atual)”

📍 Vem de: ../game/engine/ia/decidirAcaoCpu

const decidirAcaoCpu = require('../game/engine/ia/decidirAcaoCpu');


📌 Onde fica: game/engine/ia/decidirAcaoCpu.js

🖼️ Significado:

🤖 CPU olha o estado:
   fase, vida, stamina, contexto

e devolve:
   { golpe, direcao } ou { iniciarTempoAtaque: true } etc

8) uuid()

✅ Português: “gerar um id único (impossível de repetir)”

📍 Vem de: pacote uuid

const { v4: uuid } = require('uuid');


📌 Onde fica o código: é biblioteca externa (node_modules), você não precisa abrir.

🖼️ Significado:

🆔 uuid = “placa do carro” do combate
cada luta tem uma placa única

🔥 Agora vamos destrinchar o combatService por dentro (mais profundo)
A) executarAcao(combateId, payload)

✅ Português: “aplicar uma ação em uma luta existente”

1) Pegar a luta
const combate = obterCombate(combateId);


🖼️

📨 chegou: combateId=abc
      │
      ▼
🗃️ obterCombate(abc) → pega a luta certa

2) Portas de segurança
if (!combate) throw new Error('Combate nao encontrado');
if (combate.finalizado) throw new Error('Combate ja finalizado');


🖼️

🚧 2 cancela-alarme:
- “não existe”
- “já acabou”

3) Entregar a intenção ao engine
executarTurno(combate, payload);


🖼️

✉️ payload = “o que o jogador quis fazer”
⚙️ engine = “o que acontece de verdade”

4) Descobrir “quem está na vez”

Você criou uma função interna:

function obterPersonagemDaVez(combate) { ... }


✅ Português: “descobrir quem deve agir agora”

🖼️ ideia:

🎭 fase diz quem manda:
- aguardandoAtaque → atacante
- aguardandoDefesa → defensor

5) Trava de “fase que precisa de show”
function faseExigeAnimacao(fase) { ... }


✅ Português: “essa fase precisa de animação na tela?”

Você marcou:

aguardandoRolagemIniciativa

aguardandoRolagemAtaque

aguardandoRolagemDefesa

🖼️

🎲 Se precisa mostrar dado rolando:
   🛑 service para
   🖥️ devolve estado pra UI animar

6) Loop da CPU (autopilot)
while (!combate.finalizado) {
  const personagemDaVez = obterPersonagemDaVez(combate);

  if (!personagemDaVez || personagemDaVez.controlador !== 'cpu') break;
  if (faseExigeAnimacao(combate.fase)) break;

  const acaoCpu = decidirAcaoCpu(combate);
  executarTurno(combate, acaoCpu);
}


✅ Português: “se for CPU, ela joga sozinha até chegar numa fase que a tela precisa ver”

🖼️

🤖 CPU na vez?
  ├─ não → devolve pro humano
  └─ sim → decide jogada → engine executa → repete

🛑 MAS:
se cair em fase de dado/animação → para

7) Se acabou, limpa
if (combate.finalizado) removerCombate(combateId);


✅ Português: “se acabou, tira da memória”

B) iniciarCombate({ atacanteId, defensorId, ... })

✅ Português: “criar uma luta nova e rodar o primeiro passo”

1) Buscar personagens no banco
const atacante = await personagensService.buscarPorId(atacanteId);
const defensor = await personagensService.buscarPorId(defensorId);


🖼️

🗄️ banco → 🧍 ficha do atacante
🗄️ banco → 🧍 ficha do defensor

2) Definir humano vs CPU
atacante.controlador = controladorA;
defensor.controlador = controladorB;


✅ Português: “marcar quem controla cada personagem”

🖼️

Jake.controlador = "humano"
Goblin.controlador = "cpu"

3) Criar estado inicial no engine
const estado = criarEstadoInicial(atacante, defensor);


✅ Português: “engine cria o estado base da luta”

4) Montar objeto combate com ID
const combate = { id: uuid(), ...estado };


✅ Português: “colocar uma placa única e juntar com o estado”

5) Guardar no store
criarCombate(combate);


✅ Português: “guardar a luta ativa”

6) Disparar a primeira fase (iniciativa)
executarTurno(combate, {});


✅ Português: “rodar o motor uma vez para começar”

7) Se atacante for CPU, ela já anda até precisar da UI

Você repetiu a mesma filosofia, mas com mais fases “visuais/temporizadas”:

rolagens

preContagem

tempoDeAtaque/tempoDeDefesa

✅ Português: “CPU avança o combate sozinha, mas para quando entra em fase que tem contagem/cronômetro/animação”

🌟 Mini-dicionário visual (pra bater o olho e entender)
obterCombate        = 🗃️ pegar luta da prateleira
criarCombate        = 🗃️ guardar luta na prateleira
removerCombate      = 🧹 tirar luta da prateleira

buscarPorId         = 🗄️ buscar ficha no banco

criarEstadoInicial  = 🧬 nascer a luta (estado inicial)
executarTurno       = ⚙️ girar o motor (avançar fase)

decidirAcaoCpu      = 🤖 CPU escolher jogada
uuid                = 🆔 gerar placa única
