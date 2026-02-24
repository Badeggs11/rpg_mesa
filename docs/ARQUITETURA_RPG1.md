🧩 ARQUITETURA — RPG de Mesa (Síntese Oficial)

📌 1. Visão Geral do Sistema

O sistema é uma simulação em duas camadas:

Nível | Responsabilidade | Engine
Micro | Combate (luta, dano, stamina, tempo) | combatTurnos.js
Macro | Mundo (campanha, narrativa, eventos) | engine/campanha/\*

Princípio central:

Estado + Máquina de Estados + Logs Semânticos.

🧠 2. Princípios Arquiteturais Fundamentais

✔ Engine pura (sem UI, HTTP ou banco)
✔ Regras não conhecem infraestrutura
✔ Estado é a fonte única da verdade
✔ Frontend nunca calcula regras
✔ API apenas transporta mensagens
✔ IA gera intenções, não altera estado
✔ Logs são a narrativa oficial do sistema
✔ Determinismo e testabilidade isolada

Toda aleatoriedade vem exclusivamente de:

dice.js
🏗 3. Camadas do Sistema
Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services (Orquestração)
↓
Engine (Regras puras)
├── combateTurnos.js
└── campanha/
↓
Estado em memória (Fonte da Verdade)
↓
Persistência (JSON / SQLite futuro)
⚔️ 4. Engine de Combate (Micro Sistema)

Arquivo principal:

combatTurnos.js

Responsável por:

máquina de estados do combate

fases de ataque e defesa

cálculo de dano

stamina e ataques consecutivos

integração com percepção

logs semânticos da luta

A UI não interfere nas regras.
Toda verdade mecânica vive na engine.

🎭 5. Máquina de Estados do Combate

O combate funciona como uma linha do tempo determinística:

Iniciativa
→ Tempo de Ataque
→ Ataque
→ Percepção
→ Tempo de Defesa
→ Defesa
→ Resolução
→ Próximo Turno

Cada fase representa um “capítulo” da luta.

⏳ 6. Sistema de Tempo (Combate Híbrido)

O combate é:
Turn-based + Janelas de reação em tempo.

Fluxo do ataque:

aguardandoRolagemTempoAtaque
→ preContagemAtaque (UI visual)
→ tempoDeAtaque
→ aguardandoRolagemAtaque

Fluxo da defesa:

aguardandoRolagemTempoDefesa
→ preContagemDefesa
→ tempoDeDefesa
→ aguardandoRolagemDefesa

Regra crítica:

O engine NÃO usa timers reais.
A UI apenas visualiza o tempo.

👁 7. Sistema de Percepção (Leitura Tática)

Nova camada tática:

Estratégia (iniciativa)

Reflexo (tempo)

Leitura (percepção)

Fluxo:

Ataque definido
→ rolagem de percepção (D6 + atributo)
→ tempoDePercepcaoInformacao
→ direção revelada nos segundos finais da defesa

Importante:

Percepção fornece informação, não altera dano

HUD visual, não regra mecânica

🤖 8. Sistema de Agentes (Humano + CPU)

Tipos de agentes:

Tipo Origem da intenção
Humano UI / teclado
CPU decidirAcaoCpu.js
Engine valida e resolve

A CPU envia o mesmo payload que o jogador.

🎮 9. Frontend (ArenaCombate.jsx)

Funções:

interpretar combate.fase

habilitar controles válidos

enviar intenções à API

exibir log e cena narrativa

controlar tempo visual (useEffect)

Nunca:

calcula dano

roda dados

altera regras

🎲 10. Visualização de Dados 3D

O dado 3D:

roda apenas no frontend

não gera números

apenas anima resultados da engine

📜 11. Sistema de Logs (Dupla Camada Narrativa)

Log de Combate:

estado.log

Narrativa técnica da luta.

Log de Campanha:

estadoCampanha.logMundo

Crônica sistêmica do mundo.

🌍 12. Engine de Campanha (Macro Sistema do Mundo)

Local:

src/game/engine/campanha/

Responsável por:

rodadas globais do mundo

narrativa dinâmica

agentes autônomos

eventos sistêmicos

encontros perigosos

memória histórica

APR (economia de ações)

tempo global da rodada

A campanha NÃO executa combate diretamente.

📦 13. Estado Global da Campanha (Fonte da Verdade)

Estrutura central:

estadoCampanha = {
id,
rodadaGlobal,
faseCampanha,
jogadores,
ciclo,
historia,
mapa,
narrativa,
memoriaMundo,
reacaoMundo,
agentesMundo,
encontroPendente,
decisaoEncontroPendente,
gatilhoCombate,
recompensasPendentes,
logMundo
}

Características:

determinístico

serializável

persistente

testável via Node

independente da UI e API

🔁 14. Sistema de Rodada Global do Mundo

Variável central:

rodadaGlobal

Fluxo:

Jogadores agem
→ ciclo termina
→ rodadaGlobal avança
→ mundo reage automaticamente

Eventos sistêmicos:

mundo_processado

narrativa_atualizada

apr_acumulado

tempo_rodada_iniciado

autosave_rotativo

⚡ 15. Sistema APR (Action Points de Campanha)

Cada jogador possui:

aprAtual
aprPorRodada

Função:

regular ações no mundo

economia de decisões por rodada

independente do sistema de combate

🌡 16. Sistema de Reação do Mundo (Tensão Global)

Estrutura:

reacaoMundo = {
nivelTensaoGlobal,
ultimoClima,
historicoTensoes
}

Funções:

escalar perigos dinamicamente

influenciar desafios

alterar clima narrativo

Sistema passivo e determinístico.

🧟 17. Sistema de Encontros Perigosos

Quando há pressão ambiental:

encontroPendente = {
id,
tipo: 'emboscada',
perigo: 'alto',
status: 'pendente',
escolhas: ['lutar', 'fugir']
}

Decisão do jogador:

lutar → gera combate

fugir → registra histórico e mantém risco regional

Anti-spam:
Encontros pendentes não são sobrescritos.

⚔️ 18. Gatilho Sistêmico de Combate (Macro → Micro)

Conceito central:

gatilhoCombate = {
origem,
encontroId,
tipoEncontro,
perigo,
rodada,
status: 'pendente' | 'consumido',
combateId
}

Fluxo:
Campanha → gera encontro
→ cria gatilho
→ CampaignService consome
→ CombatService inicia combate

Isso mantém o desacoplamento total entre mundo e combate.

🧩 19. Campaign Service (Orquestrador)

Arquivo:

src/services/campaignService.js

Responsabilidades:

processar rodada do mundo

detectar gatilhos de combate

iniciar combate via service

atualizar estado da campanha

registrar logs macro

Retorno padrão:

{
estadoCampanha,
combate,
combateIniciado
}
🗂 20. Campaign Store (Multi-Campanhas / Multi-Mundos)

Arquivo:

src/services/campaignStore.js

Funções:

criarCampanha

obterCampanha

atualizarCampanha

removerCampanha

listarCampanhas

Arquitetura:

múltiplas campanhas simultâneas

estado em memória como fonte da verdade

pronto para persistência futura

📡 21. API da Campanha (Controller + Rotas)

Endpoints:

POST /api/campanha/iniciar
POST /api/campanha/rodada

Regra arquitetural crítica:

O frontend NÃO envia o estado completo.
Apenas o campaignId.
O servidor usa o campaignStore como fonte da verdade.

🧠 22. Memória do Mundo e Narrativa Dinâmica

Sistemas implementados:

linha do tempo do mundo

crônicas por rodada

narrativa global interpretativa

agentes autônomos (explorador, viajante, observador)

A narrativa:

interpreta o estado

não altera regras mecânicas

💾 23. Persistência e Autosave

Características:

estado serializado em JSON

hidratação do estado executável

autosave rotativo (3 slots)

recuperação de campanhas longas

A engine permanece pura (sem acesso direto ao banco).

🧪 24. Testabilidade (Princípio Central Mantido)

Todos os sistemas são testáveis isoladamente via Node:

engine de combate

engine de campanha

store multi-mundos

controller + API

persistência e hidratação

Sem dependência de:

frontend

banco

interface gráfica

🧠 25. Garantias Arquiteturais Finais

✔ Engine pura e determinística
✔ Separação Micro (Combate) vs Macro (Campanha)
✔ Estado como fonte única da verdade
✔ Combate desacoplado via gatilho sistêmico
✔ Suporte a múltiplas campanhas (multi-saves)
✔ UI não interfere em regras
✔ Logs como narrativa oficial do sistema
✔ Arquitetura modular, escalável e sandbox-ready

🎯 Síntese Final do Design

Você construiu, arquiteturalmente:

Um simulador sistêmico de RPG com:

Juiz automático (engine)

Mundo vivo (campanha)

Combate híbrido (turno + reflexo + percepção)

Narrativa emergente por logs

Multi-mundos via store

Testabilidade total fora da UI

Isso não é mais só um “sistema de combate”.
É uma engine de RPG sandbox em duas escalas (micro + macro).
