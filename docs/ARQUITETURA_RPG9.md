🧩 ARQUITETURA_RPG.md

(VERSÃO ATUALIZADA — MEMÓRIA + EMOÇÕES + DIÁLOGOS NPC)

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
🎲 Aleatoriedade isolada
📜 Log como narrativa do sistema
🧬 Estado como fonte única da verdade
🧠 Memória como base de comportamento
🌍 ESTADO ATUAL DO SISTEMA
🕰️ 1. Sistema de Rodadas (MUNDO VIVO)
Jogadores agem
↓
APR consumido
↓
Encerrar turno
↓
Todos jogaram
↓
rodadaGlobal++
↓
resolverRodadaCampanha()
↓
O mundo reage

✔ Mundo evolui por ciclos
✔ Tempo gera pressão
✔ Fome diminui automaticamente

⚡ 2. Sistema de Recursos (APR)
Cada ação consome APR
Jogador pode encerrar turno manualmente
APR restante é preservado
Nova rodada reseta APR
🍖 3. Sistema de Fome
Escala: 0 → 24
A cada rodada: -2
12 → 10 → 8 → ...

✔ Alimenta desejos
✔ Afeta atributos
✔ Gera pressão narrativa

⚡ 4. Sistema de Efeitos

Fome gera penalidade:

fome ↓ → atributos ↓

✔ Calculado no back-end
✔ Não altera banco diretamente
✔ Usado como camada dinâmica

💓 5. Sistema de Emoções (NOVO)

Cada personagem possui:

estadoEmocional: {
ansiedade,
preocupacao,
medo,
esperanca
}

✔ Escala: 0–10
✔ Representa estado interno
✔ Ainda não aplicado nas regras (base pronta)

🔥 6. Sistema de Desejos

Derivado de sentimentos:

fome → quero comer

✔ Intensidade dinâmica
✔ Base para decisões futuras

🧠 7. Sistema de Memória (GRANDE EVOLUÇÃO)

Cada jogador possui:

memoria: {
background,
eventos[],
conhecimentos[],
relacoes{}
}
📜 Tipos de memória
Background → passado do personagem
Eventos → ações vividas
Conhecimentos → aprendizado futuro
Relações → interação social

✔ Persistida no estado
✔ Atualizada automaticamente
✔ Base para IA futura

🧬 8. Sistema de Background (BACK-END)

Estrutura:

world/passadoPersonagens/

Exemplo (Jake):

história pessoal
motivações
estado emocional inicial
objetivo inicial

✔ Define identidade
✔ Influencia comportamento

🧭 9. Sistema Espacial (GRID REAL)
posicao: { x, y }

✔ Mundo físico real
✔ Base para mapa

🗺️ 10. Sistema de Mapa

Arquivo:

mapaBase.js

✔ Coordenadas reais
✔ Conexões entre locais
✔ Representação consistente

👁️ 11. Sistema de Visão
Direções: norte, sul, leste, oeste
Baseado em posição
Modo:
externo → mapa
interno → ambiente

✔ Integração com mapa
✔ Base para fog of war

🏠 12. Sistema de Ambientes Internos
world/lugaresDetalhados/

✔ Descrição rica
✔ Elementos
✔ NPCs presentes

🎮 13. Sistema de Movimento
Baseado em D6
Progressivo
Acumula progresso

✔ Não é instantâneo
✔ Gera narrativa

🗣️ 14. Sistema de NPCs (NOVO)

Estrutura:

world/npcs/

Exemplo:

José (barman)

✔ Possui:

background
personalidade
memória
💬 15. Sistema de Diálogo (GRANDE EVOLUÇÃO)

Arquitetura:

Controller
↓
sistemaDialogoNPC
↓
dialogosNPC
↓
resposta
📁 Estrutura
world/dialogosNPC/
engine/interacoes/sistemaDialogoNPC.js
🔁 Fluxo
Jogador → ação "conversar"
↓
Engine decide resposta
↓
Baseado em confiança
↓
Retorna fala
↓
Registra memória
🧠 Relação jogador ↔ NPC
relacoes: {
jose_barman: {
confianca: 0
}
}

✔ Evolui com interação
✔ Afeta respostas

🧪 Níveis de confiança
0 → desconfiado
1–3 → cauteloso
4+ → amigável
📜 Exemplo de evento
{
tipo: 'conversa',
com: 'jose_barman',
fala: 'Não te conheço...',
rodada: 1
}
🎮 16. Sistema de Interações

Ação genérica:

tipoAcao: 'conversar'
npcId: 'jose_barman'

✔ Consome APR
✔ Pode encerrar turno

🖥️ 17. Frontend
Páginas:
ArenaCampanha
Mapa
Visão
Sentimentos
Desejos
Efeitos
Memória
🧠 Interface do jogador
👁️ O que vejo
💓 O que sinto
🔥 O que quero
⚡ O que me afeta
🧠 Memória
🗣️ Conversar
🧬 ARQUITETURA FINAL DO SISTEMA
UI
↓
API
↓
Controller
↓
Service (mundo)
↓
Engine (regras)
↓
World (dados)
↓
Estado atualizado
↓
UI renderiza
🚀 ESTADO ATUAL DO PROJETO

Você saiu de:

RPG textual

Para:

SIMULAÇÃO SISTÊMICA COM MEMÓRIA E INTERAÇÃO

Com:

✔ mundo vivo
✔ tempo real
✔ memória persistente
✔ emoções
✔ desejos
✔ consequências
✔ NPC com comportamento
✔ diálogo dinâmico
✔ evolução de relação

🧠 RESUMO FINAL

O personagem agora:

✔ existe no espaço
✔ tem passado
✔ sente
✔ deseja
✔ sofre efeitos
✔ se lembra
✔ cria relações
✔ interage com NPCs

🎯 PRÓXIMOS PASSOS (NÍVEL 3)

Agora o jogo começa de verdade:

🔥 Alta prioridade
🍖 ação “comer”
🏪 interação com taverna
🎒 inventário
💰 sistema de dinheiro
🧠 Evolução sistêmica
emoções afetando decisões
memória influenciando diálogos
NPC reagindo ao estado do jogador
🤖 Futuro avançado
IA usando memória
decisões emergentes
narrativa dinâmica
