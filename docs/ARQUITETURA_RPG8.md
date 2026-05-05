🧩 ARQUITETURA_RPG.md
(VERSÃO ATUALIZADA — MOVIMENTO + MAPA VISUAL)
🧠 VISÃO GERAL

O sistema segue a arquitetura:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Interface do jogador)
Princípios centrais:
🧠 Engine controla regras e estado
🔌 API transporta intenções
🎮 Frontend apenas renderiza e envia ações
🎲 Aleatoriedade isolada (dados)
📜 Log como narrativa do sistema
🌍 ESTADO ATUAL DO SISTEMA
🕰️ 1. Sistema de Rodadas (MUNDO VIVO)

Fluxo consolidado:

Jogadores agem
↓
APR consumido
↓
Turno encerra
↓
Todos ficam prontos
↓
rodadaGlobal++
↓
resolverRodadaCampanha()
↓
O mundo reage

✔ Mundo evolui por ciclos
✔ Nada acontece instantaneamente
✔ Base de simulação viva

🧭 2. Sistema Espacial (GRID REAL)

Jogadores possuem:

posicao: { x, y }

E também:

estadoCampanha.mapa.posicaoJogadores[jogadorId] = {
localAtual,
pos
}

✔ Mundo deixou de ser abstrato
✔ Base para mapa visual
✔ Suporte híbrido: grid + locais

👁️ 3. Sistema de Percepção (VISÃO)

Função central:

calcularCampoVisao(posicao, alcance)

Retorna:

matriz[][] de tiles

✔ Baseado em distância (Chebyshev)
✔ Integração com mapa
✔ Base para fog of war

🗺️ 4. Sistema de Mapa (ESTRUTURA)

Arquivo:

mapaBase.js

Estrutura:

{
id,
nome,
descricao,
pos: { x, y },
conexoes: []
}

✔ Coordenadas reais
✔ Representação espacial consistente
✔ Conexões entre locais (grafo)

🎮 5. Sistema de Movimento (CORE)
Arquivo:
calcularCustoMovimento.js

Responsável por:

calcular distância
aplicar rolagem de dado
acumular progresso
definir sucesso
Regra:
Movimento = esforço progressivo 🎲

Exemplo:

Distância: 6

Turno 1 → rolou 1 → progresso 1
Turno 2 → rolou 5 → progresso 6 → sucesso
Estrutura:
{
distanciaTotal,
progressoAcumulado,
faltando,
conseguiuMover
}
🚶 6. Sistema de Movimento (EXECUÇÃO)

Arquivo:

sistemaMovimentoMapa.js

Responsável por:

validar movimento
atualizar posição
atualizar exploração
gerar log
Atualização final do estado:
estadoCampanha.mapa.posicaoJogadores[jogadorId] = {
localAtual,
pos
}

✔ Fonte única de verdade
✔ Sincronizado com frontend

🔌 7. API — AÇÃO "MOVER"

Endpoint:

POST /api/campanha/acao

Payload:

{
"tipoAcao": "mover",
"destino": "taverna",
"resultadoDado": 5
}
Fluxo:
Frontend
↓
Controller
↓
calcularCustoMovimento
↓
(sucesso?)
↓
moverJogadorNoMapa
↓
estado atualizado
↓
log gerado
⚡ 8. Sistema de Recursos (APR)

✔ Movimento consome 1 APR
✔ Turno encerra quando APR = 0
✔ Integração com ciclo de rodada

🗺️ 9. MAPA VISUAL (FRONTEND — GRANDE EVOLUÇÃO)

Arquivo:

MapaCampanha.jsx
🔥 Nova abordagem:

Antes:

lista de botões ❌

Agora:

mapa em matriz visual ✅
🧠 Geração do mapa
montarGridDoMapa()
calcula min/max X e Y
cria matriz
posiciona locais
🎨 Renderização:

Cada tile:

ícone (emoji)

- nome do local
- status (📍 você está aqui)
  🧍 Representação do jogador
  🧍 substitui o ícone do local atual
  🧭 Interação
  clique no tile → onMover(localId)
  🔁 Sincronização
  sessionStorage
  ↓
  MapaCampanha (polling 500ms)
  ↓
  re-render automático
  🧬 ARQUITETURA FINAL DO MOVIMENTO
  UI (Mapa / Botão)
  ↓
  API (executarAcaoCampanha)
  ↓
  Controller
  ↓
  Engine (cálculo)
  ↓
  Engine (execução)
  ↓
  Estado atualizado
  ↓
  sessionStorage
  ↓
  Mapa renderiza
  🧭 ONDE VOCÊ ESTÁ AGORA

Você saiu de:

RPG textual

Para:

SIMULAÇÃO VISUAL INTERATIVA

Com:

✔ mapa renderizado
✔ jogador visível
✔ movimento baseado em dado
✔ progresso acumulado
✔ mundo reagindo
✔ UI sincronizada

🧠 RESUMO FINAL

O personagem agora:

✔ existe no espaço
✔ tem posição real
✔ se move com esforço
✔ aparece visualmente
✔ interage com o mapa
✔ altera o estado do mundo

🚀 PRÓXIMO PASSO (NÍVEL 2)

Agora que o movimento funciona:

🎯 Prioridades naturais:
🎲 animação do dado (D20 3D)
📊 barra de progresso de movimento
👁️ campo de visão real (sem mock)
🌫️ fog of war
🎥 câmera seguindo jogador
🧍 animação de movimento (não teleportar)
📍 PONTO DE RETOMADA

Quando abrir o próximo chat:

👉 diga:

Vamos evoluir o mapa com fog of war e campo de visão real

ou

Vamos adicionar animação de movimento no mapa
