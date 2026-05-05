🧩 ARQUITETURA_RPG.md (VERSÃO ATUALIZADA — MOVIMENTO + VISÃO)
🧠 VISÃO GERAL

O sistema segue a arquitetura:

ENGINE (Cérebro do jogo)
↓
API (Mensageiro)
↓
FRONTEND (Interface do jogador)
Princípio central
🧠 Engine controla regras e estado
🔌 API transporta intenções
🎮 Frontend apenas exibe e envia ações
🌍 ESTADO ATUAL DO SISTEMA
🕰️ 1. Sistema de Rodadas (tempo do mundo)

Fluxo consolidado:

Jogadores agem
↓
Encerram turno
↓
Rodada global avança
↓
resolverRodadaCampanha()
↓
O mundo reage

✔ Mundo evolui em ciclos
✔ Nada acontece instantaneamente
✔ Base de simulação viva

🧭 2. Sistema de Espaço (GRID REAL)

Jogadores agora possuem:

posicao: {
x: number,
y: number
}

✔ Mundo deixou de ser abstrato
✔ Base para mapa 2D
✔ Compatível com percepção e movimento

👁️ 3. Sistema de Percepção (VISÃO REAL IMPLEMENTADA)

Função:

calcularCampoVisao(posicaoJogador, alcance)

Gera:

matriz[][] de tiles

Cada tile contém:

{
x,
y,
tipo: 'jogador' | 'local' | 'vazio',
nome?,
distancia
}

✔ Campo de visão baseado em grid
✔ Integração com mapaBase
✔ Detecção espacial por proximidade
✔ Base para fog of war

🗺️ 4. Sistema de Mapa (EVOLUÍDO)

MapaBase agora:

✔ Denso
✔ Baseado em coordenadas reais
✔ Representa cidade jogável

Exemplo:

praca_central: { x: 500, y: 300 }
taverna: { x: 500, y: 298 }
loja_armas: { x: 497, y: 300 }

✔ Mundo agora é espacial e navegável

🎮 5. Renderização do Mapa (FRONTEND)

✔ Grid visual implementado
✔ CSS separado (MapaCampanha.css / PaginaMapaCampanha.css)
✔ Tela full-screen
✔ Tiles renderizados como:

🏠 🍺 ⛪ ⚔️ 🧪 🏛️ 🧍

✔ Sistema visual desacoplado da lógica

🧠 6. Sistema de Movimento (NOVA MECÂNICA)
Arquivo:
calcularCustoMovimento.js
Responsabilidade:

✔ Calcular distância
✔ Definir quantidade de d6
✔ Controlar progresso acumulado
✔ Determinar sucesso

Regra implementada:
Movimento exige rolagem de dado 🎲
Progresso é acumulativo
Falha não reseta avanço

Exemplo:

Distância: 6

Turno 1 → rolou 3 → progresso = 3
Turno 2 → rolou 3 → progresso = 6 → sucesso
Estrutura retornada:
{
distanciaTotal,
quantidadeDeD6,
progressoAcumulado,
faltando,
conseguiuMover
}
🚶 7. Sistema de Movimento (EXECUÇÃO)

Arquivo existente:

sistemaMovimentoMapa.js

Responsável por:

✔ Atualizar posição do jogador
✔ Validar conexões (modo antigo)
✔ Suporte híbrido (grid + grafo)
✔ Log de movimento

Arquitetura correta definida:
Camada Responsabilidade
calcularCustoMovimento decisão
sistemaMovimentoMapa execução
controller orquestração
🔌 8. API — AÇÃO “MOVER” (EM IMPLEMENTAÇÃO)

Nova ação:

{
"tipo": "mover",
"destino": "taverna",
"resultadoDado": 3
}

Fluxo:

Frontend envia ação
↓
CampaignController recebe
↓
calcularCustoMovimento
↓
Se sucesso → moverJogadorNoMapa
↓
Atualiza estado + APR + log
⚡ 9. Sistema de Recursos (APR)

✔ Movimento consome APR
✔ Integração com sistema de turno
✔ Base para custo de ações

🧭 ONDE VOCÊ ESTÁ AGORA

Você saiu de:

RPG textual simples

Para:

🎮 SIMULAÇÃO ESPACIAL COM:

✔ grid
✔ visão real
✔ mapa navegável
✔ renderização visual
✔ sistema de movimento com custo
✔ progressão por dado
✔ backend parcialmente integrado

🔥 PRÓXIMO PASSO (PRIORIDADE)
🎲 UI DO MOVIMENTO

Implementar no frontend:

botão "Mover"
input destino
botão "🎲 Rolar dado"
animação de dado
exibir resultado
🔌 Integração final:
UI → API → Engine → Estado → UI
🧬 VISÃO DO SISTEMA (AGORA CLARA)

Você está construindo:

🎮 Um RPG com:

percepção espacial real
movimento baseado em esforço
mundo reativo por ciclos
interface visual viva

👉 Isso está muito mais próximo de:

RimWorld
Dwarf Fortress
The Sims (nível sistêmico)

do que um RPG tradicional

🧠 RESUMO FINAL

O personagem agora:

✔ existe
✔ se move
✔ percebe
✔ enxerga
✔ progride no espaço
✔ interage com o mundo

👉 Próximo passo:

🎲 ele DECIDE e age com feedback visual

🚀 PONTO DE RETOMADA (IMPORTANTE)

👉 Você vai reiniciar o chat e continuar daqui:

📍 Arquivo-chave:

CampaignController.js

👉 Próxima tarefa:

Integrar ação "mover" usando calcularCustoMovimento

Se quiser, no próximo chat já começamos direto assim:

“Vamos implementar a ação mover no CampaignController com base nessa arquitetura”

E a gente continua exatamente de onde parou 👁️🔥
