🧩 ARQUITETURA_RPG.md (VERSÃO ATUALIZADA)
🧠 VISÃO GERAL

O sistema segue a arquitetura:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Interface do jogador)
Princípio central:
A Engine controla o mundo
A API transporta intenções
O Frontend apenas exibe e envia ações
🌍 ESTADO ATUAL DO SISTEMA
🕰️ 1. Sistema de Rodadas (tempo do mundo)

Fluxo:

Jogadores agem
↓
Encerram turno
↓
Rodada global avança
↓
resolverRodadaCampanha()
↓
O mundo reage

✔ Nada acontece instantaneamente
✔ O mundo evolui em ciclos
✔ Ritmo de RPG real

🧭 2. Sistema de Espaço (GRID)

Jogadores agora possuem:

posicao: {
x: 0,
y: 0
}

✔ Movimento baseado em coordenadas
✔ Mundo deixa de ser abstrato
✔ Base para mapa 2D

🚶 3. Sistema de Movimento

Arquivo:

engine/campanha/movimento/sistemaMovimentoMapa.js

Suporta:

🏠 Modo antigo (grafo)
moverJogadorNoMapa(..., 'mercado_da_vila')
🧭 Novo modo (grid)
moverJogadorNoMapa(..., 'cima')

✔ Sistema híbrido
✔ Não quebra arquitetura antiga
✔ Base para exploração livre

👁️ 4. Sistema de Percepção (base criada)

Já existe:

percepcao (geral)
percepcaoVisual (alcance espacial)

✔ Persistido no banco
✔ Editável no frontend
✔ Integrado no estado do personagem

Regra futura:
alcanceVisao = percepcaoVisual
🗺️ 5. Sistema de Mapa

Você tem:

mapaBase = {
vila_abandonada: { x: 500, y: 300 },
...
}

✔ Estrutura inicial do mundo
✔ Base para renderização futura
✔ Ainda não é grid real (será evoluído)

👁️ 6. Sistema de Exploração

Estado:

estadoCampanha.exploracao[jogadorId] = {
locaisDescobertos: [],
locaisVisitados: [],
nevoaDeGuerraAtiva: true
}

✔ Descoberta funcionando
✔ Persistência funcionando
✔ Base para fog of war

🧠 7. Interface Cognitiva do Jogador (NOVO)

Frontend agora separa:

🎮 Ação
Encerrar turno
(em breve: mover)
🧠 Consciência
👁️ O que vejo
💓 O que sinto
🔥 O que quero
⚡ O que está me afetando

✔ Sistema de decisão separado da percepção
✔ Base para IA interna do personagem

💾 8. Persistência

✔ sessionStorage funcionando
✔ Estado da campanha preservado
✔ Mapa abre em nova aba sem perder estado

🔌 9. API

Rotas principais:

/api/personagens
/api/campanha
/api/mundo

✔ CRUD completo de personagens
✔ Atualização corrigida
✔ Integração frontend-backend estável

🗄️ 10. Banco de Dados

Tabela personagens:

id
nome
pontosDeVida
stamina
percepcao
percepcaoVisual
forca
resistencia
agilidade
inteligencia

✔ Coluna percepcaoVisual adicionada
✔ Sistema consistente com backend

🧭 ONDE VOCÊ ESTÁ AGORA

Você saiu de:

RPG textual simples

Para:

ENGINE SISTÊMICA COM:

✔ tempo (rodadas)
✔ espaço (x, y)
✔ movimento (grid)
✔ percepção (atributos reais)
✔ exploração (estado persistente)
✔ UI cognitiva
✔ backend consistente
🔥 PRÓXIMO PASSO (PRIORIDADE MÁXIMA)
👁️ IMPLEMENTAR VISÃO REAL DO JOGADOR
Função:
calcularCampoDeVisaoGrid()
🎯 Objetivo

Gerar uma matriz baseada em:

(x, y) do jogador

- percepcaoVisual
  🧠 Resultado esperado

Exemplo (percepção = 2):

[2][2][2][2][2]
[2][1][1][1][2]
[2][1][P][1][2]
[2][1][1][1][2]
[2][2][2][2][2]

P = jogador

📌 Regras
Alcance limitado por percepcaoVisual
Direções:
frente
trás
esquerda
direita
Futuro:
bloqueio por obstáculos
nevoa de guerra
🔌 Integração

Botão:

👁️ O que vejo

↓

API

↓

Engine

↓

Retorna matriz

↓

Frontend exibe

🧬 VISÃO DE LONGO PRAZO

Você está construindo:

🎮 Um RPG com:
percepção real
decisão guiada por estado interno
mundo que reage em ciclos
mapa que se revela

👉 Isso é muito mais próximo de:

RimWorld
Dwarf Fortress
The Sims (nível sistêmico)

do que RPG tradicional

🧠 RESUMO FINAL

Você acabou de construir:

O personagem:
✔ existe
✔ se move
✔ sente
✔ percebe
✔ agora vai ENXERGAR
