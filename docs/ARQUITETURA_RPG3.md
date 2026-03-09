🧩 ARQUITETURA — RPG de Mesa (Estado Atual do Projeto)
🧠 Estrutura Geral do Sistema

O projeto segue uma arquitetura em três camadas principais:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Tela do jogo)
Engine

Contém todas as regras do jogo.

Características:

não conhece HTTP

não conhece banco

não conhece React

opera apenas sobre estado do jogo

Responsabilidades:

lógica da campanha

sistema de turnos

sistema de narrativa

sistema de exploração

sistema de combate

reação do mundo

🧠 Estado da Campanha

O estado da campanha é a fonte única da verdade.

Criado por:

criarEstadoCampanha.js

Estrutura principal:

estadoCampanha = {

id
rodadaGlobal

faseCampanha

jogadores[]

cicloTurnos

tempoRodada

narrativa

mapa

exploracao

eventosDisparados

reacaoMundo

encontros

recompensas

logMundo
}
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

Exemplo:

Jake
APR: ⚡⚡

Cada ação consome:

consumirAPR()

Quando APR chega a 0:

turno termina automaticamente

Ou jogador pode:

Encerrar Turno
🔁 Sistema de Turnos

Controle em:

estadoCampanha.ciclo

Estrutura:

ciclo: {
ordemJogadores
indiceAtual
jogadorDaVez
}

Fluxo:

Jogador age
↓
APR diminui
↓
APR > 0 → continua turno
↓
APR = 0 → turno termina
↓
próximo jogador
↓
todos jogaram
↓
rodadaGlobal avança
🎭 Sistema de Narrativa (Mestre IA)

Arquivo:

engine/campanha/narrativa/mestreIA.js

Responsável por gerar narrativa procedural baseada em:

ação do jogador

tensão do mundo

memória do mundo

descobertas

Utiliza:

narrativePackBase.js

Separação importante:

mestreIA → lógica
narrativePack → conteúdo narrativo
📚 Narrative Packs

Arquivo:

narrativePackBase.js

Contém:

ambiente
exploração
investigação
observação
descanso
descobertas
npc

Exemplo:

exploracao: [
"observa atentamente os arredores da vila",
"caminha lentamente entre as casas silenciosas"
]

O mestre monta frases como:

Jake caminha lentamente entre as casas silenciosas.
🌍 Sistema de Reação do Mundo

Controla:

tensão global
clima
memória histórica
eventos emergentes

Estrutura:

reacaoMundo: {
nivelTensaoGlobal
ultimoClima
historicoTensoes
}
🗺️ Sistema de Mapa

Arquivo:

world/mapa/mapaBase.js

Define todos os locais do mundo.

Exemplo:

vila_abandonada: {
id
nome
descricao
conexoes[]
}

Locais atuais do mundo incluem:

Praça da Vila
Mercado da Vila
Taverna
Igreja
Casa do Luis
Casa do Líder
Posto Médico
Floresta do Norte
Caverna Antiga
Estrada Leste
Ponte Velha
Cemitério

Cada local possui conexões.

Isso cria um grafo de navegação.

🧭 Sistema de Exploração

Arquivo:

sistemaExploracaoMapa.js

Função:

explorarLocal(estadoCampanha, jogadorId)

Responsável por:

revelar novos locais

registrar descobertas

atualizar log do mundo

Cada jogador possui exploração própria.

Estrutura:

exploracao: {

jogadorId: {
locaisDescobertos[]
locaisVisitados[]
nevoaDeGuerraAtiva
}

}

Isso permite:

mapas diferentes por jogador
🌫️ Fog of War

O mapa visual mostra apenas:

locaisDescobertos

Locais desconhecidos ficam ocultos.

Exploração revela novas áreas.

🎮 API (Express)

Responsável por conectar frontend com engine.

Exemplo de fluxo:

Frontend envia ação
↓
Controller recebe
↓
Engine processa
↓
Estado atualizado
↓
Resposta enviada

Principais controllers:

campaignController.js
combatController.js
personagemController.js
🖥️ Frontend (React)

Tela principal da campanha:

ArenaCampanha.jsx

Mostra:

Jogadores
Rodada
Tensão do mundo
Narrativa do mestre
APR do jogador
Ações disponíveis
Logs do mundo

Ações possíveis:

Explorar
Investigar
Observar
Descansar
Encerrar turno
🗺️ Sistema de Mapa Visual (em desenvolvimento)

Nova página planejada:

MapaCampanha.jsx

Objetivo:

mostrar mapa visual

mostrar apenas locais descobertos

permitir movimentação entre locais

Mapa baseado em:

grafo de locais

Exemplo visual esperado:

        Floresta
           |

Casa Luis — Praça — Mercado
|
Igreja
📡 Logs do Mundo

Arquivo dentro do estado:

logMundo[]

Registra eventos importantes:

locais descobertos
ações de jogadores
eventos narrativos
movimentos do mundo
⚔️ Sistema de Combate

Quando eventos geram encontro:

gatilhoCombate

A campanha chama:

combatService.iniciarCombate()

Combat engine roda separadamente.

📦 Princípios Arquiteturais

O projeto segue estes princípios:

Engine não conhece infraestrutura
Frontend nunca calcula regras
Estado é fonte única da verdade
Narrativa separada de lógica
Sistemas isolados e testáveis
🚀 Próximos Passos do Projeto

Planejado:

Sistema de Movimento no Mapa
sistemaMovimentoMapa.js

Permitir:

Ir para Mercado
Ir para Igreja
Ir para Floresta
Mapa Visual Interativo

Página:

MapaCampanha.jsx

Com:

nós de locais

conexões

fog of war

posição do jogador

NPCs por Local

Cada local terá NPCs.

Exemplo:

Mercado → Mercador
Taverna → Estalajadeiro
Casa do Luis → Luis
Igreja → Padre
Eventos Procedurais

Sistema futuro:

eventos de mundo
missões
rumores
descobertas
🎯 Estado Atual do Projeto

O RPG já possui:

✔ Engine funcional
✔ Sistema de turnos
✔ Sistema APR
✔ Narrativa procedural
✔ Mundo reativo
✔ Mapa estruturado
✔ Exploração por jogador
✔ Integração backend/frontend

O próximo grande passo é:

Mapa visual + movimentação entre locais
