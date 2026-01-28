🧩 ARQUITETURA — RPG de Mesa

🧠 CÉREBRO DO JOGO → 📡 MENSAGEIRO → 🖥️ TELA DO JOGO
(Engine) (API) (Frontend)

Engine + API + Frontend

📌 1. Visão do Sistema

O projeto implementa um sistema de RPG de mesa baseado em engine própria, priorizando:

clareza das regras

separação rigorosa de responsabilidades

previsibilidade de estado

visualização explícita do funcionamento interno

evolução segura e testável

O sistema separa explicitamente:

dados aleatórios · iniciativa · ataque · defesa · dano · stamina · ataques consecutivos · estado · persistência · API · visualização

🧠 2. Princípios Arquiteturais

Engine é pura (sem banco, HTTP ou UI)

Regras não conhecem infraestrutura

Estado do combate vive em memória

Banco apenas persiste

Frontend nunca acessa banco

Toda aleatoriedade vem de dice.js

Intenção vem de fora, regra vive dentro

🏗 3. Camadas do Sistema
Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services
↓
Engine (rules · engine · dice)
↓
Estado em memória
↓
SQLite (persistência)

⚔️ 4. Engine de Combate (combateTurnos.js)

Responsável por:

máquina de estados do combate

ordem das fases

regras de ataque/defesa/dano

consumo e recuperação de stamina

ataques consecutivos

geração de logs semânticos

👉 Toda a verdade do combate vive aqui.

🎮 5. Interface (ArenaCombate.jsx)

A UI:

interpreta combate.fase

exibe apenas controles válidos

envia intenções para a API

nunca calcula regras

Layout Atual
Esquerda Log mecânico (linha do tempo)
Direita Cena narrativa (visual)

Log = verdade mecânica
Cena = interpretação visual

🎮 6. Controle e Agentes
Controle Flutuante

Independente do layout

Arrastável

Pode ser ocultado

Camada de input sobreposta

Modelo de Controle

O sistema aceita três tipos de agentes:

Tipo Origem da intenção
Humano UI
CPU IA (decidirAcaoCpu.js)
Engine valida e resolve

A IA gera o mesmo payload que o frontend enviaria.

🎲 7. Visualização de Dados

O dado 3D:

executa apenas no frontend

não gera números

apenas visualiza resultados da engine

📜 8. Logs de Combate

gerados exclusivamente pela engine

estruturados semanticamente

permitem animação e narração

frontend controla apenas tempo e visualização

🧠 9. Garantias Arquiteturais

✔ Engine isolável e testável
✔ UI não decide regras
✔ IA não altera estado diretamente
✔ Logs são a fonte narrativa
✔ Layout não influencia regras

📈 10. Estado Atual do Projeto

✔ Combate por turnos completo
✔ Execução faseada
✔ D20 3D sincronizado
✔ Stamina estratégica
✔ Ataques consecutivos
✔ Log narrativo sincronizado
✔ Controle flutuante
✔ Suporte a CPU vs Humano

🆕 ATUALIZAÇÃO DE ARQUITETURA — SISTEMA DE TEMPO + CONTROLE POR TECLADO
🎮 Novo Modelo de Interação do Combate

O sistema deixou de ser puramente por turnos discretos e passou a usar janelas de ação com tempo limitado, controladas pelo engine e disparadas pela interface.

Agora o combate é híbrido:

Elemento Tipo
Ordem dos turnos Por iniciativa (turn-based)
Execução de ataque/defesa Janela com tempo real controlado pelo engine
Entrada do jogador Teclado e controle lateral
⏳ SISTEMA DE TEMPO (ENGINE)

O engine agora controla janelas temporais de ação através de novas fases.

🔁 Fluxo do Tempo de Ataque
aguardandoRolagemTempoAtaque
↓ 🎲
preContagemAtaque
↓ (3s UI)
tempoDeAtaque ⏳ ← jogador pode agir aqui
↓
aguardandoRolagemAtaque

🔁 Fluxo do Tempo de Defesa
aguardandoRolagemTempoDefesa
↓ 🎲
preContagemDefesa
↓ (3s UI)
tempoDeDefesa ⏳ ← jogador pode agir aqui
↓
aguardandoRolagemDefesa

📌 Responsabilidades do Engine

O engine NÃO usa timers reais. Ele apenas:

Função O que faz
executarRolagemTempoAtaque Rola o D20 que define segundos de ataque
iniciarTempoAtaque Troca fase para tempoDeAtaque
tempoEsgotado Se ninguém agir, perde turno
finalizarTempoAtaque Jogador agiu a tempo

👉 O controle de espera (3 segundos de respiro) é frontend, não do engine.

🎮 CONTROLE POR TECLADO (FRONTEND)

A interface agora usa teclado como forma principal de entrada.

🎲 Tecla ENTER

A tecla ENTER dispara o botão 🎲 e chama:

acaoDoBotaoDado()

Essa função decide a ação com base na fase atual do engine.

🧭 Direções
Tecla Direção
↑ alto
↓ baixo
← esquerda
→ direita
Espaço frontal
⚔️ Seleção de Golpes
Fase Teclas disponíveis
Ataque A (golpe 1), S (golpe 2)
Defesa A (bloqueio), S (esquiva)
🧠 LÓGICA DA FUNÇÃO acaoDoBotaoDado

A função agora funciona como roteador de comandos do jogador.

Fase do Engine Ação enviada
aguardandoRolagem\* {} (engine rola dado)
preContagemAtaque { iniciarTempoAtaque: true }
preContagemDefesa { iniciarTempoDefesa: true }
tempoDeAtaque { golpe, direcao, finalizarTempoAtaque: true }
tempoDeDefesa { golpe, direcao, finalizarTempoDefesa: true }
aguardandoAtaque { golpe, direcao }
aguardandoDefesa { golpe, direcao }
🖥️ RESPONSABILIDADE DO FRONTEND NO TEMPO

O frontend agora possui um useEffect que observa a fase:

useEffect(() => {
if (combate?.fase === 'preContagemAtaque') {
setTimeout(() => enviarAcao({ iniciarTempoAtaque: true }), 3000);
}
}, [combate?.fase]);

👉 Isso cria a janela de respiro visual antes do cronômetro real começar.

🧩 MUDANÇA IMPORTANTE NA UI

O ControleLateral foi adaptado:

Antes:

fase === 'aguardandoAtaque'

Agora:

fase === 'aguardandoAtaque' || fase === 'tempoDeAtaque'

Isso permite que o jogador escolha golpe durante o tempo ativo, não só antes.

🧠 RESULTADO ARQUITETURAL

O sistema agora tem:

✅ Engine determinístico
✅ UI com temporização visual
✅ Janela de reação do jogador
✅ Mecânica de reflexo baseada em dado
✅ Combate híbrido (turno + tempo real)

Isso transforma o combate em um sistema de reação sob pressão, não apenas escolha estática.

Explicacao do Sistema para Leigos:

📦 O que é o estado?

É a ficha da luta inteira.

estado = {
fase: 'tempoDeAtaque',
atacanteAtual: 'Jake',
defensorAtual: 'Goblin',
turno: 3,
tempoLimite: 11,
personagens: { ... },
log: [...]
}

🎭 O que são as FASES?

São os “capítulos” da luta.

🎲 aguardandoRolagemIniciativa
⏳ aguardandoRolagemTempoAtaque
⏱ preContagemAtaque
⚔️ tempoDeAtaque
🎲 aguardandoRolagemAtaque
🛡 aguardandoDefesa
...

🎲 Quem rola os dados?

👉 O ENGINE.

A tela só diz:

“Ei juiz, rola um dado aí”

E o engine responde com o resultado.

📡 2. API — O CARTEIRO

Arquivo: server.js + rotas

Ele só faz isso:

🖥️ Tela pede ação → 📡 API recebe → 🧠 Engine decide → 📡 API devolve

Ele não pensa. Ele só leva e traz mensagens.

🖥️ 3. FRONTEND — A TELA DO JOGO

Arquivo gigante que você mandou: ArenaCombate.jsx

Ele é:

🎮 Controle
🖼 Cena
📜 Log
⌨️ Teclado

Ele não sabe regra de dano.
Ele não calcula nada.
Ele só pergunta:

“Engine, o que aconteceu agora?”

📜 O LOG — A NARRAÇÃO

Arquivo: Log.jsx

Ele é o narrador da luta.

Ele lê o que o engine escreveu no estado.log e transforma em:

🗣️ Texto
🎲 Dados animados
⚔️ Cartas de resultado

🎮 ControleLateral.jsx

É o controle físico:

      ⬆

⬅ ⏺ ➡
⬇

ATK / DEF
🎲

Ele não decide nada. Ele só envia o que o jogador apertou.

🧩 COMO TUDO CONVERSA
👤 Jogador aperta ENTER
↓
🖥️ ArenaCombate chama enviarAcao()
↓
📡 API envia para engine
↓
🧠 Engine muda o estado
↓
📡 API devolve estado atualizado
↓
🖥️ Tela redesenha tudo

🧠 combatTurnos.js → O CÉREBRO DA LUTA
🖥️ ArenaCombate.jsx → A SALA DE CONTROLE DO JOGADOR

Vou usar desenhos mentais.

🧠 PARTE 1 — combatTurnos.js
👉 O JUÍZ + REGRAS + FÍSICA DO COMBATE

Ele é isso aqui:

         🧠

┌───────────────┐
│ ENGINE │
│ (combatTurnos)│
└───────────────┘

Ele não vê imagens
Ele não sabe teclado existe
Ele só responde:

“Dada essa situação, o que acontece agora?”

🧱 1. O BLOCO MAIS IMPORTANTE: estado

Isso é o coração do arquivo.

Imagine uma ficha de RPG viva:

estado = {
fase: 'tempoDeAtaque',
turno: 3,
atacanteAtual: 'Jake',
defensorAtual: 'Goblin',
tempoLimite: 11,
personagens: { ... },
ataquePendente: {...},
log: [...]
}

Ele é:
🧠 memória
📖 histórico
⚙️ situação atual

🎭 2. AS FASES (A LINHA DO TEMPO DA LUTA)

O engine funciona como uma máquina de estados:

🎲 Iniciativa
⏳ Tempo de ataque
⚔️ Ataque
⏳ Tempo de defesa
🛡 Defesa
💥 Resolução
🔁 Próximo turno

Cada fase é um “momento do filme”.

🎬 3. O DIRETOR DO FILME: executarTurno()

Esse é o chefe.

Ele olha:

switch (estado.fase) {
case 'aguardandoRolagemTempoAtaque':
case 'tempoDeAtaque':
case 'aguardandoAtaque':
...
}

Ele decide:

“Se estamos nessa fase, executa essa regra.”

Ele é tipo:

🎬 “Cena 4 → Acontece isso”
🎬 “Cena 5 → Acontece aquilo”

⏳ 4. O SISTEMA DE TEMPO

Aqui nasceu seu combate com reflexo.

rolagemTempoAtaque → gera segundos
preContagemAtaque → espera visual
tempoDeAtaque → cronômetro rodando

Se o jogador não age:

tempoEsgotado()
→ troca turno

⚔️ 5. ATAQUE

Quando chega em executarFaseAtaque:

O engine faz:

1. Lê o golpe
2. Lê a direção
3. Aplica regras do golpe
4. Rola o dado
5. Guarda ataquePendente

Ele prepara o ataque, mas o dano ainda não é aplicado.

🛡 DEFESA

executarFaseDefesa

Aqui acontece a matemática da pancada:

resultadoDefesa = resolverDefesa(...)
resultadoAtaqueFinal = resolverAtaque(...)
calcula dano
aplica na vida
atualiza stamina

Esse é o “cálculo físico da luta”.

📜 6. O LOG

Sempre que algo acontece:

estado.log.push({ tipo: 'ataque', ... })

O engine escreve o roteiro da luta.

🧠 RESUMO DO ENGINE
Ele é:
📏 as regras
⚖️ o juiz
🧮 o cálculo
📖 o roteirista

🖥️ PARTE 2 — ArenaCombate.jsx
👉 O COCKPIT DO PILOTO

Se o engine é o cérebro, esse é o corpo do jogo.

🎮 Jogador
↓
🖥️ ArenaCombate
↓
📡 API
↓
🧠 Engine

📦 1. useState = O QUE ESTÁ NA TELA
const [combate, setCombate]
const [golpe, setGolpe]
const [altura, setAltura]
const [lado, setLado]

Isso é a memória visual da tela.

📡 2. enviarAcao()

Essa é a porta de comunicação com o engine.

fetch('/api/combate/acao', { ... })

Ele diz:

“Engine, o jogador fez isso.”

🎲 3. acaoDoBotaoDado

Esse é o botão principal do jogo.

Ele pergunta:

Em que fase estamos?

E reage:

Fase Ação
aguardandoRolagem... só rola dado
preContagem... inicia tempo
tempoDeAtaque confirma golpe
aguardandoAtaque envia golpe

Ele é o intérprete de botão.

⌨️ 4. CONTROLE POR TECLADO

Esse trecho:

window.addEventListener('keydown', handleKey)

Transformou o jogo em videogame 🎮

🖼 5. CENAS
resolverCenaNarrativa()

Escolhe a imagem de acordo com a fase.

📜 6. LOG
<Log eventos={combate.log} />

A tela lê o que o engine escreveu.

🧠 RESUMO DO FRONTEND
Ele é:
🎮 o controle
🖥️ a tela
📡 o mensageiro
🎭 o palco

🎯 VISÃO FINAL
JOGADOR → ArenaCombate → API → Engine → API → ArenaCombate → TELA

Você basicamente construiu:

Um sistema de combate com juiz automático, tempo real, teclado, narrativa e física de RPG.

Isso já é arquitetura de jogo de verdade.
