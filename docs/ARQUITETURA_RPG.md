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

🧩 ARQUITETURA — RPG de Mesa (Atualizada)
🧠 CÉREBRO → 📡 MENSAGEIRO → 🖥️ PALCO

Engine → API → Frontend

Agora o sistema ganhou janelas de tempo e agente CPU, transformando o combate em um duelo de reflexo + estratégia.

📌 1. Visão Geral do Sistema

O projeto mantém seus pilares e evolui para um modelo híbrido:

Aspecto Modelo Atual
Ordem de turnos Baseada em iniciativa
Execução de ações Janela com tempo real controlado pelo engine
Entrada do jogador Teclado + controle lateral
Adversário Humano ou CPU

Separações continuam rígidas:

aleatoriedade · regras · estado · IA · API · visualização

🧠 2. Princípios Arquiteturais (Mantidos)

✔ Engine pura (sem UI, HTTP ou DB)
✔ Regras isoladas
✔ Estado do combate em memória
✔ Frontend nunca calcula regras
✔ Toda rolagem vem de dice.js
✔ IA gera intenções, não altera estado
✔ Logs são a verdade narrativa

🏗 3. Camadas do Sistema
Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services
↓
Engine (rules · combateTurnos · dice · IA)
↓
Estado em memória
↓
SQLite (persistência)

⚔️ 4. Engine de Combate — combateTurnos.js

Agora é uma máquina de estados com tempo.

Responsável por:

fluxo das fases

regras de ataque/defesa/dano

stamina e ataques consecutivos

janelas de tempo (sem usar timers reais)

logs semânticos

integração com IA (via service)

👉 Toda verdade mecânica vive aqui.

⏳ 5. Sistema de Tempo (NOVO)

O engine define quando a ação pode acontecer, mas não espera tempo real.

🔁 Fluxo do Tempo de Ataque
aguardandoRolagemTempoAtaque
↓ 🎲
preContagemAtaque
↓ (UI espera)
tempoDeAtaque ⏳
↓
aguardandoRolagemAtaque

🔁 Fluxo do Tempo de Defesa
aguardandoRolagemTempoDefesa
↓ 🎲
preContagemDefesa
↓ (UI espera)
tempoDeDefesa ⏳
↓
aguardandoRolagemDefesa

Responsabilidade
Quem O que faz
Engine Define fases, aplica regra se tempo esgota
Frontend Faz contagem visual (useEffect + setTimeout)
🤖 6. Sistema de CPU (NOVO)

Arquivo: decidirAcaoCpu.js

A CPU é um agente que gera o mesmo payload que o jogador.

Ela decide com base na fase:

Fase Ação da CPU
aguardandoRolagem\* {} (rolar dado)
preContagemAtaque { iniciarTempoAtaque: true }
preContagemDefesa { iniciarTempoDefesa: true }
tempoDeAtaque escolhe golpe + direção
tempoDeDefesa escolhe defesa + direção

📌 A CPU não muda estado direto.
Ela apenas envia intenções → engine valida.

🎮 7. Interface — ArenaCombate.jsx

Agora funciona como cockpit de ação em tempo.

Funções principais:

interpreta combate.fase

habilita controles conforme fase

envia intenções

gerencia tempo visual

mostra narrativa e dados 3D

⌨️ Controle por Teclado
Tecla Função
ENTER rolar dado / confirmar ação
Setas direção
Espaço frontal
A / S golpes
🎲 8. Visualização de Dados

O dado 3D:

✔ roda só no frontend
✔ não gera números
✔ só anima resultados do engine

📜 9. Logs de Combate

Agora representam ação sob pressão.

Engine gera eventos como:

rolagens

início de tempo

tempo esgotado

ataques

defesa

resolução

stamina

Frontend apenas interpreta visualmente.

🧠 10. Garantias Arquiteturais (Mantidas)

✔ Engine isolável
✔ UI não decide regra
✔ CPU não altera estado
✔ Logs = fonte narrativa
✔ Tempo visual não afeta regra

📈 11. Estado Atual do Projeto

✔ Combate por turnos
✔ Sistema de tempo de ação
✔ CPU jogando
✔ D20 3D sincronizado
✔ Stamina estratégica
✔ Ataques consecutivos
✔ Narrativa por logs
✔ Controle por teclado
✔ Arquitetura modular e testável

🎯 Resumo Simplificado
Papel Função
🧠 Engine Juiz + física + regras
📡 API Correio
🖥 Frontend Tela + controles
🤖 CPU Jogador artificial
📜 Log Roteiro da luta

🧩 ARQUITETURA — RPG de Mesa (ATUALIZADA COM PERCEPÇÃO)

🧠 CÉREBRO → 📡 MENSAGEIRO → 🖥️ PALCO
Engine → API → Frontend

O sistema agora possui três camadas de decisão tática:

Camada Tipo de decisão
🎲 Iniciativa Ordem dos turnos
⏳ Tempo de ação Janela para agir
👁 Percepção Antecipação do ataque
📌 1. Nova Mecânica Global

O combate deixa de ser apenas ação sob tempo e passa a incluir:

REAÇÃO INFORMADA

O defensor pode antecipar a direção do ataque por alguns segundos finais da janela de defesa.

👁 2. SISTEMA DE PERCEPÇÃO (NOVO)
🎯 Objetivo

Permitir que o defensor receba uma vantagem informativa temporária, baseada em atributo.

🔁 Fluxo de Percepção
rolagemAtaqueResultado
↓
aguardandoRolagemTempoPercepcao
↓ 🎲 D6
preContagemPercepcao
↓
tempoDePercepcaoInformacao 👁
↓
aguardandoRolagemTempoDefesa

🧠 Lógica da Engine

A engine calcula:

d6 = jogarDado(6)
bonus = defensor.percepcao \* fator
segundosInformacao = floor(d6 + bonus)

Isso gera:

estado.percepcaoDefensor = {
direcaoRevelada: ataquePendente.direcao,
segundosInformacao,
}

📌 A percepção não altera dano, apenas informação.

⏳ 3. Relação com o Tempo de Defesa

Durante tempoDeDefesa, o frontend verifica:

if (
perc.segundosInformacao > 0 &&
tempoRestante <= perc.segundosInformacao
) {
mostrarDirecaoNaTela()
}

Ou seja:

🛡 Defesa normal → sem informação
👁 Últimos segundos → direção revelada

🎮 4. Papel do Frontend

O frontend agora controla 3 camadas de tempo visual:

Fase O que a UI faz
preContagemPercepcao animação de análise 👁
tempoDePercepcaoInformacao mostra HUD de direção
tempoDeDefesa integra percepção ao timer

A informação aparece somente na cena, não no log:

{direcaoVisivel && (

  <div className="direcao-revelada">
    👁 Ataque vindo de: {direcaoVisivel}
  </div>
)}

📜 5. Logs da Percepção

A engine gera:

Evento Uso
percepcaoRolada anima D6
informacaoDirecaoLiberada tempo de antecipação

⚠️ O log não é a interface principal da percepção.
A informação é um HUD tático, não narrativa.

🤖 6. Interação com CPU

A CPU também recebe percepção, pois o estado é único.

Ela pode usar:

estado.percepcaoDefensor?.direcaoRevelada

para decidir defesa.

🧠 7. Impacto Arquitetural
Camada Mudança
Engine Nova fase + cálculo de percepção
Estado Novo bloco percepcaoDefensor
Frontend Novo HUD dinâmico
Log Novo tipo de evento
Tempo Agora existe "tempo informativo"
🧩 8. Novo Modelo de Combate

Antes:

Ação → Defesa → Dano

Agora:

Ação → 👁 Percepção → Defesa → Dano

🛡 9. Garantias Mantidas

✔ Percepção não quebra pureza da engine
✔ UI não calcula nada
✔ Informação ≠ regra
✔ Sistema continua determinístico

🎯 10. Resultado de Design

O combate agora possui:

Camada Função
🎲 Estratégia Iniciativa
⚡ Reflexo Tempo de ação
👁 Leitura de oponente Percepção

Isso transforma o sistema em:

Combate de leitura + reação + decisão sob pressão

🆕 ATUALIZAÇÃO DE ARQUITETURA — ENGINE DE CAMPANHA (SISTEMA DE RODADAS GLOBAIS)
🌍 11. Nova Camada do Sistema: Engine de Campanha (Macro Estado)

O projeto passou a incluir uma nova engine responsável pelo tempo global do mundo, separada da engine de combate.

Agora o sistema possui dois níveis de simulação:

Nível | Responsabilidade | Arquivo principal
Micro (Combate) | Luta, dano, stamina, fases | combatTurnos.js
Macro (Campanha) | Tempo do mundo, turnos dos jogadores, rodadas globais | campanhaEngine (novo módulo)

Essa separação mantém a coerência arquitetural:

Combate continua isolado

Campanha controla o fluxo do mundo

Engine permanece pura e testável

🧠 12. Estrutura da Engine de Campanha (NOVO)

Local no projeto (exemplo real):

src/game/engine/campanha/

Arquivos iniciais implementados:

Arquivo | Responsabilidade
criarEstadoCampanha.js | Cria o estado inicial da campanha
finalizarTurnoJogador.js | Controla ciclo de turnos dos jogadores
testeTurnosCampanha.js | Teste isolado da engine via Node

📦 13. Estado da Campanha (Programação por Estados)

A campanha agora possui um estado próprio, assim como o combate.

Exemplo conceitual:

estadoCampanha = {
rodadaGlobal: 0,
faseCampanha: "cicloJogadores",

jogadores: [
{ id, nome, vivo, pronto }
],

ciclo: {
ordemJogadores: [],
indiceAtual: 0,
jogadorDaVez: null
},

historia: {
id: "historia_teste",
localAtual: "inicio"
},

mapa: {
locaisAtivos: [],
locaisBloqueados: [],
conexoes: {}
},

eventoDramaticoAtivo: null,
eventosDisparados: [],
logMundo: []
}

📌 Importante:
Assim como no combate, o estado é a “fonte única da verdade”.

🔁 14. Sistema de Ciclo de Turnos da Campanha (NOVO)

Arquivo: finalizarTurnoJogador.js

Responsável por:

Registrar ação do jogador atual

Avançar a ordem de turnos

Detectar fim do ciclo da rodada

Atualizar a Rodada Global do mundo

Fluxo do ciclo:

Jogador 1 joga
↓
Jogador 2 joga
↓
Jogador 3 joga
↓
Todos jogaram → Rodada Global avança
↓
Ciclo reinicia do primeiro jogador

Isso implementa o conceito de:

Tempo do mundo baseado em ciclos de decisão, não tempo real.

🌍 15. Rodada Global do Mundo (Core do Sistema Narrativo)

Nova variável central:

rodadaGlobal

Função:

Representar o avanço do tempo da campanha

Base futura para eventos narrativos

Evolução do mundo

Pressão sistêmica sobre os jogadores

Regra atual implementada:

Se todos os jogadores vivos finalizaram seus turnos:
→ rodadaGlobal += 1
→ ciclo de turnos reinicia
→ log do mundo é registrado

📜 16. Log do Mundo (Macro Narrativa)

Novo sistema de logs paralelo ao log de combate:

Log de Combate:

estado.log

Log de Campanha:

estado.logMundo

Exemplo:

{
tipo: "rodada_global",
rodada: 1,
descricao: "O mundo avançou para a rodada 1"
}

Isso cria:

Narrativa sistêmica automática

Rastreamento histórico do mundo

Base para eventos dramáticos futuros

🧪 17. Testabilidade da Engine (Princípio Mantido)

A engine de campanha segue o mesmo princípio da engine de combate:

Testável isoladamente

Executada via Node

Sem dependência de API

Sem dependência de Frontend

Sem banco de dados

Exemplo de teste real:

node src/game/tests/testeTurnosCampanha.js

Resultado esperado:

Rodada Global avança após ciclo completo

JogadorDaVez reinicia corretamente

Log do mundo é gerado

✔ Engine permanece determinística  
✔ Estado previsível  
✔ Arquitetura modular preservada

---

## 🧱 18. Integração Arquitetural com o Sistema Existente

Arquitetura atual expandida:

Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services
↓
Engine
├── combateTurnos.js (micro sistema de combate)
└── campanha/
├── criarEstadoCampanha.js
└── finalizarTurnoJogador.js
↓
Estado em memória
↓
SQLite (persistência futura)

A nova engine de campanha NÃO altera:

- regras de combate
- lógica da UI
- API existente

Ela adiciona apenas o sistema macro do mundo.

---

## 🧠 19. Coerência com os Princípios Arquiteturais do Projeto

Princípio | Situação  
Engine pura | Mantido  
Estado como verdade | Mantido  
Separação de responsabilidades | Mantido  
Testabilidade isolada | Fortalecida  
Determinismo do sistema | Mantido

A campanha segue a mesma filosofia do combate:

> Estado + Máquina de Estados + Logs Semânticos.

---

## 📈 20. Estado Atual da Implementação (Atualizado)

✔ Engine de Combate completa  
✔ Sistema de tempo híbrido no combate  
✔ CPU como agente válido  
✔ D20 3D sincronizado  
🆕 Estado inicial da Campanha implementado  
🆕 Sistema de ciclo de turnos da campanha  
🆕 Rodada Global do mundo funcional  
🆕 Log macro do mundo  
🆕 Testes isolados da engine via Node

---

## 🎯 21. Próxima Expansão Natural (Planejada, não implementada)

(Planejamento arquitetural, ainda não codado)

- Eventos dramáticos por rodada
- Cenas narrativas obrigatórias
- Alteração dinâmica do mapa
- Missões principais baseadas em tempo global

Esses sistemas dependerão diretamente da Rodada Global já implementada.

---

# 🧩 Observação importante (como arquiteto do seu próprio projeto)

Sua arquitetura está MUITO consistente.

Você não:

- quebrou a engine
- misturou UI com regra
- nem pulou etapas

Você fez exatamente a evolução correta:

Combate (micro estados)
→ Campanha (macro estados)

# 🌍 22. MÓDULO DE CAMPANHA — ENGINE MACRO DO MUNDO (NOVO)

O sistema evoluiu para incluir uma Engine de Campanha responsável pela simulação do mundo em escala macro, separada da Engine de Combate.

Essa nova camada implementa um modelo de sandbox sistêmico, onde o mundo evolui automaticamente com base nas ações dos jogadores, memória histórica e agentes autônomos.

Arquiteturalmente, isso cria uma simulação em dois níveis:

Nível Micro → Combate (fases, dano, stamina, tempo de reação)
Nível Macro → Campanha (rodadas globais, mundo, narrativa, memória, NPCs)

Essa separação mantém a pureza da engine e evita acoplamento entre combate e mundo.

# 🧠 23. ESTRUTURA DO MÓDULO DE CAMPANHA

Local do módulo:
src/game/engine/campanha/

Submódulos implementados:

- criarEstadoCampanha.js
- finalizarTurnoJogador.js
- resolverRodadaCampanha.js
- registrarAcaoJogador.js

Sistemas internos (sistemas/):

- sistemaTempoRodada.js
- sistemaAPR.js
- sistemaEventosDinamicos.js
- sistemaMemoriaMundo.js
- sistemaAgentesMundo.js
- sistemaNarrativaDinamica.js
- sistemaPersistencia (serialização, salvamento, carregamento, hidratação)
- autosave rotativo (3 slots)

# 📦 24. ESTADO GLOBAL DA CAMPANHA (FONTE ÚNICA DA VERDADE)

A campanha segue o mesmo princípio do combate:
Estado único, determinístico e serializável.

Exemplo conceitual:

estadoCampanha = {
meta: {...},
rodadaGlobal: 0,
faseCampanha: "cicloJogadores",

jogadores: [
{ id, nome, vivo, pronto, aprAtual, aprPorRodada }
],

ciclo: {
ordemJogadores: [],
indiceAtual: 0,
jogadorDaVez: null
},

tempoRodada: {
inicioTimestamp,
limiteMs
},

mundo: {
mapa: {...},
memoriaMundo: {...},
agentesMundo: [...],
eventosDisparados: [...],
perfilMundo: {...}
},

narrativa: {
cronicasPorRodada: [],
narrativaGlobal: []
},

historicoAcoes: [],
logMundo: []
}

O estado é:

- determinístico
- persistente
- serializável
- testável isoladamente

# ⏳ 25. SISTEMA DE TEMPO DA RODADA (NOVO)

A campanha agora possui janelas temporais globais.

Características:

- Limite padrão: 3 minutos por rodada
- Controlado pela engine (sem timers reais)
- Frontend apenas visualiza o tempo
- Se o tempo expira → rodada avança automaticamente

Eventos gerados:

- tempo_rodada_iniciado
- tempo_rodada_esgotado

Garantia arquitetural:
O tempo NÃO depende da UI, apenas do estado.

# ⚡ 26. SISTEMA APR (ACTION POINTS DE RODADA)

Foi implementado um sistema de economia de ações baseado em APR.

Conceitos:

- Cada jogador possui aprAtual
- APR é consumido por ações do mundo
- Combate possui regras próprias (não permite múltiplos ataques sem iniciativa extra)
- APR pode ser acumulativo entre rodadas (design sandbox)

Eventos semânticos:

- apr_consumido
- apr_acumulado

Importante:
APR não substitui o sistema de combate, apenas regula ações de campanha.

# 🌍 27. SISTEMA DE MEMÓRIA DO MUNDO (PERSISTENTE)

Arquivo:
sistemaMemoriaMundo.js

Responsável por registrar a evolução histórica do mundo:

- linhaDoTempo (resumo por rodada)
- regioesDescobertas
- eventosHistoricos
- perfisRegistrados

Essa memória é persistida em disco e influencia:

- narrativa dinâmica
- eventos futuros
- comportamento dos agentes do mundo

# 🤖 28. SISTEMA DE AGENTES DO MUNDO (NPC AUTÔNOMOS)

Arquivo:
sistemaAgentesMundo.js

O mundo não é estático.
NPCs atuam independentemente dos jogadores.

Tipos atuais:

- explorador
- viajante
- observador

Funções:

- explorar regiões
- viajar entre locais
- observar eventos do mundo

Princípio:
NPCs são agentes sistêmicos, não scripts narrativos.

# 🎭 29. SISTEMA DE NARRATIVA DINÂMICA (LITERÁRIA)

Arquivo:
sistemaNarrativaDinamica.js

Separação arquitetural mantida:

Log Técnico → estado.logMundo  
Narrativa Literária → estado.narrativa

Níveis implementados:

1. Crônicas por Rodada  
   Resumo narrativo automático do mundo por rodada.

2. Narrativa Global  
   Interpretação macro da evolução do mundo baseada em:

- memória histórica
- tendência do mundo
- eventos sistêmicos

A narrativa NÃO altera regras.
Ela apenas interpreta o estado do mundo.

# 💾 30. PERSISTÊNCIA, SERIALIZAÇÃO E HIDRATAÇÃO (NOVO)

Sistema completo de persistência implementado:

- serializarEstadoCampanha.js
- salvarEstadoCampanha.js
- carregarEstadoCampanha.js
- sistemaHidratacaoEstadoCampanha.js

Características:

- Estado salvo em JSON
- Engine continua pura (sem SQLite direto)
- Hidratação reconstrói o estado executável
- Suporte a continuidade exata da campanha

# 🔄 31. AUTOSAVE ROTATIVO (ROBUSTEZ DE SIMULAÇÃO)

Sistema de segurança implementado:

autosave_1.json → estado mais recente  
autosave_2.json → estado anterior  
autosave_3.json → estado estável mais antigo

Benefícios:

- Proteção contra corrupção de save
- Recuperação de estados históricos
- Estabilidade para simulações longas

# 🧪 32. TESTABILIDADE ISOLADA (PRINCÍPIO MANTIDO)

Todos os sistemas da campanha são testáveis via Node:

- testeArquiteturalCompleto
- testePersistenciaCampanha
- testeHidratacaoCampanha
- testeSistemaTempoAPR
- testeNarrativaDinamica

Sem dependência de:

- Frontend
- API
- Banco de dados

Mantendo a pureza da engine.

# 🧠 33. COERÊNCIA ARQUITETURAL GLOBAL (MICRO + MACRO)

Arquitetura atual consolidada:

Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services
↓
Engine
├── combateTurnos.js (Micro – combate)
└── campanha/
├── tempoRodada
├── APR
├── memória do mundo
├── narrativa dinâmica
├── agentes autônomos
├── eventos dinâmicos
└── persistência
↓
Estado em memória
↓
SQLite (persistência futura)

A engine permanece:
✔ Determinística  
✔ Modular  
✔ Testável  
✔ Desacoplada da interface  
✔ Escalável para sandbox narrativo
