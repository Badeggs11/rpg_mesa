ARQUITETURA_RPG_MESA_v3.md

ou

ARQUITETURA_RPG_MESA_ATUAL.md
🧩 ARQUITETURA — RPG de Mesa (Estado Atual do Projeto)
🧠 Estrutura Geral do Sistema

O sistema segue uma arquitetura em três camadas bem definidas:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Interface do jogador)

Princípio central:

A Engine controla o estado do mundo.
A API apenas transporta intenções.
O Frontend apenas exibe o estado.

🧠 1. ENGINE (Cérebro do Jogo)

Local:

src/game/engine

A Engine contém todas as regras do jogo.

Ela não conhece:

HTTP

Express

React

Banco de dados

Frontend

Ela trabalha apenas com:

estadoCampanha
🌍 Estado da Campanha (Fonte Única da Verdade)

Criado por:

engine/campanha/criarEstadoCampanha.js

Estrutura principal:

estadoCampanha = {

id
rodadaGlobal

faseCampanha

jogadores[]

ciclo

tempoRodada

historia

objetivoCampanha

narrativa

mapa

exploracao

eventosDisparados

eventoDramaticoAtivo

reacaoMundo

encontroPendente
decisaoEncontroPendente
gatilhoCombate

recompensasPendentes

logMundo
}

O estado é mantido em memória no servidor.

👥 Sistema de Jogadores

Cada jogador possui:

{
id
nome
vivo
pronto

aprPorRodada
aprAtual
}

APR = Ações Por Rodada

Exemplo visual:

Jake

APR: ⚡⚡

Cada ação consome APR:

consumirAPR()

Quando APR chega a zero:

turno termina automaticamente

ou o jogador pode:

Encerrar Turno
🔁 Sistema de Turnos

Controle:

estadoCampanha.ciclo

Estrutura:

ciclo: {
ordemJogadores
indiceAtual
jogadorDaVez
}

Fluxo:

Jogador executa ação
↓
APR diminui
↓
APR > 0 → continua turno
↓
APR = 0 → jogador fica pronto
↓
finalizarTurnoJogador()
↓
próximo jogador
↓
todos prontos
↓
processarRodadaCampanha()
🧠 Engine de Processamento do Mundo

Arquivo central:

resolverRodadaCampanha.js

Ele executa os sistemas do mundo na ordem:

Interpretar ações dos jogadores
↓
Sistema Mestre da Campanha
↓
Consequências sistêmicas
↓
Eventos dinâmicos
↓
Resolução de encontros
↓
Memória histórica do mundo
↓
Reputação social
↓
Reação sistêmica do mundo
↓
Desafios dinâmicos
↓
Resolução de desafios
↓
Encontros perigosos
↓
Recompensas contextuais
↓
Narrativa dinâmica
↓
Crônica do mestre
↓
Agentes do mundo (NPCs)
↓
Autosave
↓
Reset APR
↓
Reinício do tempo da rodada
🎭 Sistema de Narrativa

Arquivo:

engine/campanha/narrativa/mestreIA.js

Função:

gerarNarrativa(estadoCampanha)

Responsável por gerar narrativa baseada em:

tensão global

eventos recentes

ações dos jogadores

memória do mundo

Conteúdo narrativo separado em:

narrativePackBase.js
🧭 Sistema de Exploração

Arquivo:

engine/campanha/sistemas/sistemaExploracaoMapa.js

Função:

explorarLocal(estadoCampanha, jogadorId)

Responsabilidades:

revelar locais conectados

atualizar exploração do jogador

registrar log do mundo

Estrutura de exploração:

exploracao: {

jogadorId: {
locaisDescobertos[]
locaisVisitados[]
nevoaDeGuerraAtiva
}

}

Cada jogador possui seu próprio mapa descoberto.

🗺️ Sistema de Mapa

Arquivo:

world/mapas/mapaBase.js

Define o grafo do mundo.

Exemplo:

vila_abandonada: {

id: 'vila_abandonada',

nome: 'Vila Abandonada',

descricao: 'Uma pequena vila abandonada.',

pos: { x: 500, y: 300 },

conexoes: [
'floresta_norte',
'estrada_leste',
'mercado_da_vila',
'casa_do_luis'
]
}

Características:

✔ grafo de navegação
✔ conexões entre locais
✔ posição espacial (pos)
✔ suporte a renderização visual

📍 Sistema de Posição dos Jogadores

Estrutura:

mapa: {

localAtual

posicaoJogadores: {

    jogadorId: localId

}

}

Exemplo:

posicaoJogadores: {
j1: 'vila_abandonada',
j2: 'vila_abandonada'
}

Permite:

jogadores em locais diferentes

exploração paralela

movimentação independente

🚶 Sistema de Movimento no Mapa

Arquivo:

engine/campanha/sistemas/sistemaMovimentoMapa.js

Função:

moverJogadorMapa()

Responsável por:

validar conexões do mapa

atualizar posição do jogador

registrar log do mundo

Fluxo:

Frontend solicita movimento
↓
API recebe requisição
↓
campaignService chama moverJogadorMapa
↓
estadoCampanha atualizado
↓
frontend recebe novo estado
🎮 API (Express)

Local:

src/controllers
src/routes
src/services

Arquitetura:

Route
↓
Controller
↓
Service
↓
Engine
📡 Controllers Principais
campaignController.js
combatController.js
personagemController.js

Responsabilidade:

✔ validar requisições
✔ chamar services
✔ retornar estado atualizado

🧠 Services

Arquivo principal:

campaignService.js

Responsável por:

orquestrar engine

iniciar combate

processar rodada

mover jogador no mapa

🗂️ Campaign Store

Arquivo:

services/campaignStore.js

Responsável por manter campanhas vivas em memória.

Funções:

criarCampanha()
obterCampanha()
listarCampanhas()
🖥️ FRONTEND (React)

Local:

src/pages
src/components
src/api
🎮 Tela Principal da Campanha

Arquivo:

ArenaCampanha.jsx

Mostra:

jogadores

rodada atual

tensão global

narrativa do mundo

APR do jogador

ações disponíveis

logs do mundo

mapa da campanha

🗺️ Componente de Mapa

Arquivo:

MapaCampanha.jsx

Responsável por:

mostrar locais descobertos

indicar posição do jogador

permitir movimentação

integrar com API de movimento

Entrada do componente:

<MapaCampanha
  estadoCampanha
  jogadorId
  mapaBase
  onMover
/>
🌫️ Sistema Fog of War

O mapa exibe apenas:

locaisDescobertos

Locais desconhecidos permanecem ocultos.

Exploração revela novas áreas.

📜 Sistema de Logs do Mundo

Estrutura:

logMundo[]

Registra:

ações dos jogadores

eventos sistêmicos

mudanças do mundo

descobertas

movimentos

Logs são a história oficial do mundo.

⚔️ Sistema de Combate

Quando eventos geram encontro:

gatilhoCombate

A campanha chama:

combatService.iniciarCombate()

A engine de combate roda separadamente.

📦 Princípios Arquiteturais

O projeto segue estes princípios:

Engine não conhece infraestrutura
Frontend nunca calcula regras
Estado é fonte única da verdade
Narrativa separada da lógica
Sistemas isolados e testáveis
Regras determinísticas
Logs narrativos do sistema
🎯 Estado Atual do Projeto

O RPG atualmente possui:

✔ Engine funcional
✔ Sistema de turnos
✔ Sistema APR
✔ Sistema de narrativa procedural
✔ Sistema de reação do mundo
✔ Sistema de reputação
✔ Sistema de desafios
✔ Sistema de encontros perigosos
✔ Sistema de exploração
✔ Sistema de mapa estruturado
✔ Sistema de movimentação no mapa
✔ Posição individual de jogadores
✔ Fog of war por jogador
✔ API integrada
✔ Frontend funcional
✔ Mapa da campanha visível na interface

🚀 Próximos Passos Naturais da Arquitetura

Evoluções planejadas:

🗺️ Mapa Visual Espacial

Usar coordenadas:

pos: { x, y }

para renderizar um mapa gráfico real.

👥 NPCs por Local

Cada local terá agentes vivos:

Mercado → Mercador
Igreja → Padre
Taverna → Estalajadeiro
Casa do Luis → Luis
🎲 Eventos Procedurais

Sistema futuro:

rumores

missões

descobertas

acontecimentos globais

🧠 IA Mestre Avançada

O Mestre da Campanha poderá:

gerar histórias

criar eventos

reagir aos jogadores

🧩 Resumo Arquitetural

O projeto implementa um RPG sistêmico emergente, baseado em:

Estado + Máquina de Estados + Sistemas Independentes

Arquitetura:

ENGINE
↓
API
↓
FRONTEND

Cada camada possui responsabilidades bem definidas.

Se quiser, no próximo chat posso também te entregar uma versão ainda mais poderosa dessa arquitetura chamada:

ARQUITETURA RPG MESA — DESIGN DE SISTEMAS (v4)
