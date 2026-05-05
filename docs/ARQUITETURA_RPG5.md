🧩 ARQUITETURA — RPG de Mesa (Versão Atualizada)
🧠 Estrutura Geral do Sistema

O sistema segue uma arquitetura em três camadas bem definidas:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Interface do jogador)

Princípio central:

A Engine controla o estado do mundo

A API transporta intenções

O Frontend apenas exibe o estado

Toda a lógica do RPG vive na engine.

🧠 1. ENGINE (Cérebro do Jogo)

Local:

src/game/engine

A engine contém todas as regras do mundo.

Ela não conhece:

HTTP

Express

React

Banco de dados

Frontend

Ela opera apenas sobre:

estadoCampanha

Responsabilidades da engine:

narrativa

turnos

exploração

eventos do mundo

combate

consequências sistêmicas

🌍 2. Estado da Campanha (Fonte Única da Verdade)

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

O estado vive em memória no servidor.

👥 3. Sistema de Jogadores

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

Cada ação consome APR.

Quando APR chega a 0:

turno termina automaticamente
🔁 4. Sistema de Turnos

Controle em:

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
APR = 0 → jogador pronto
↓
próximo jogador
↓
todos prontos
↓
processar rodada do mundo
🧠 5. Pipeline da Engine de Campanha

Arquivo central:

resolverRodadaCampanha.js

Pipeline do mundo:

Interpretar ações dos jogadores
↓
Sistema de percepção espacial
↓
Mestre da campanha
↓
Consequências sistêmicas
↓
Eventos dinâmicos
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
Agentes do mundo
↓
Autosave
↓
Reset APR
↓
Reinício do tempo da rodada
🗺 6. Sistema de Mapa Espacial

Arquivo:

world/mapa/mapaBase.js

Cada local possui posição espacial:

pos: { x, y }

Exemplo:

vila_abandonada: {
id: "vila_abandonada",
nome: "Vila Abandonada",
pos: { x: 500, y: 300 }
}

O mapa é um grafo espacial.

Locais possuem:

id
nome
descricao
pos
conexoes

Isso permite:

renderização visual do mapa

exploração por distância

detecção espacial de entidades

📍 7. Posição Espacial dos Jogadores

Estrutura:

mapa: {

localAtual

posicaoJogadores: {

    jogadorId: {
      localAtual
      pos: { x, y }
    }

}

}

Isso permite:

movimento físico no mapa

exploração espacial

múltiplos jogadores em locais diferentes

🚶 8. Exploração Espacial

Arquivo:

sistemaPercepcaoEspacial.js

Explorar agora significa:

o jogador caminha pelo mapa

Fluxo:

Explorar
↓
jogador se move alguns metros
↓
engine calcula raio de visão
↓
locais dentro do raio são descobertos
↓
mapa é atualizado
↓
narrativa é gerada

Cálculo:

distância = √((x2-x1)² + (y2-y1)²)

Se:

distância < raioDeVisão

Então:

local descoberto
🌫 9. Sistema de Exploração Individual

Cada jogador possui seu próprio mapa descoberto.

Estrutura:

exploracao: {

jogadorId: {

    locaisDescobertos[]

    locaisVisitados[]

    nevoaDeGuerraAtiva

}

}

Isso cria:

Fog of War individual
👁 10. Sistema de Percepção Espacial

Arquivo:

sistemaPercepcaoEspacial.js

Função:

sistemaPercepcaoEspacial(estadoCampanha, jogadorId, mapaBase)

Responsável por:

mover jogador

calcular campo de visão

detectar locais próximos

registrar descobertas

atualizar logs

Resultado:

o mundo é revelado gradualmente
🎭 11. Sistema de Narrativa

Arquivo:

engine/campanha/narrativa/mestreIA.js

Função:

gerarNarrativa(estadoCampanha)

A narrativa interpreta:

ações dos jogadores

tensão global

descobertas espaciais

eventos do mundo

A narrativa não altera o estado.

Ela apenas descreve o que aconteceu.

🎬 12. Cena Inicial da Campanha

Quando a campanha começa, o mundo já possui uma narrativa inicial.

Exemplo:

Jake desperta na praça de uma vila abandonada.
Casas silenciosas cercam o local.
Uma rua segue em direção ao mercado,
outra leva à floresta ao norte.

Essa cena é baseada no mapaBase.

🌍 13. Sistema de Reação do Mundo

Estrutura:

reacaoMundo: {

nivelTensaoGlobal
ultimoClima
historicoTensoes

}

Funções:

escalar perigos

alterar clima narrativo

gerar pressão sistêmica

⚔️ 14. Sistema de Encontros

Quando o mundo gera perigo:

encontroPendente

Exemplo:

{
tipo: "emboscada",
perigo: "alto",
inimigos: "goblins"
}

Jogadores decidem:

lutar
fugir
🖥 15. Frontend (React)

O frontend não executa regras.

Ele apenas mostra:

estado do mundo

narrativa

ações possíveis

mapa da campanha

🎮 16. ArenaCampanha

Arquivo:

frontend/src/pages/ArenaCampanha.jsx

Responsabilidades:

exibir narrativa

exibir ações

exibir estado do mundo

enviar ações para API

O mapa foi removido desta página.

🗺 17. Página de Mapa

Arquivo:

PaginaMapaCampanha.jsx

Rota:

/mapa

Responsabilidades:

mostrar mapa completo

renderizar locais descobertos

mostrar posição do jogador

permitir movimentação

A tela da campanha possui apenas:

link para abrir o mapa
📡 API

Fluxo:

Frontend
↓
Router
↓
Controller
↓
Service
↓
Engine

A API nunca executa regras do jogo.

📦 Princípios Arquiteturais

O projeto segue estes princípios:

Engine não conhece infraestrutura
Frontend nunca calcula regras
Estado é fonte única da verdade
Narrativa separada da lógica
Sistemas independentes
Arquitetura modular
Regras determinísticas
Logs narrativos do mundo
🎯 Estado Atual do Projeto

O RPG possui:

✔ Engine de campanha
✔ Sistema de turnos
✔ Sistema APR
✔ Narrativa procedural
✔ Reação sistêmica do mundo
✔ Eventos emergentes
✔ Desafios dinâmicos
✔ Encontros perigosos
✔ Sistema de exploração
✔ Mapa espacial com coordenadas
✔ Movimento no mapa
✔ Percepção espacial
✔ Fog of war
✔ API integrada
✔ Frontend funcional
✔ Página de mapa dedicada
🚀 Próximas Evoluções Naturais

Evoluções planejadas:

👥 NPCs Espaciais

NPCs terão posição no mapa.

npc: {
id
pos {x,y}
}
🧠 IA de Mundo

NPCs poderão:

patrulhar

reagir aos jogadores

gerar eventos

🎲 Eventos Procedurais

Eventos poderão surgir baseados em:

tensão global

exploração

tempo do mundo

🗺 Renderização Visual do Mapa

Usando:

pos {x,y}

para desenhar o mapa automaticamente.

🧩 Síntese Final

O projeto implementa um RPG sistêmico emergente, baseado em:

Estado

- Máquina de Estados
- Sistemas Independentes
- Mapa Espacial
- Narrativa Procedural

Arquitetura final:

ENGINE
↓
API
↓
FRONTEND

A engine controla o mundo.

O frontend apenas observa.

O mundo reage às ações dos jogadores.

💡 Quando você reiniciar o chat, eu consigo continuar exatamente desse ponto, porque agora sua arquitetura está documentada.

E o próximo passo natural do seu RPG será algo muito interessante:

NPCs vivos andando no mapa e reagindo aos jogadores.
Isso é o que realmente transforma um RPG em um mundo vivo.
