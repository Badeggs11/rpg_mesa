🧩 ATUALIZAÇÃO OFICIAL — ARQUITETURA RPG (CAMADA DE CAMPANHA ONLINE)

Vou te entregar no MESMO estilo do seu documento para você colar direto no manual do projeto.

Você pode adicionar isso como:

Seção 26 — Integração Frontend ↔ Backend da Campanha (Mundo Vivo)

🌐 26. Integração Frontend ↔ Backend da Campanha (Mundo Vivo)
📡 Nova Camada Conectiva do Sistema

Com a introdução do ArenaCampanha.jsx, a arquitetura evoluiu de um sistema apenas simulável via Node/CLI para um sistema interativo em tempo real, onde:

Jogador (UI)
→ envia intenções
→ Backend interpreta
→ Engine processa o mundo
→ Estado atualizado retorna ao Frontend

Princípio mantido:

A UI NUNCA executa regras do jogo.

🧠 Fluxo Arquitetural Atual (Campanha Online)
Fluxo completo de uma ação do jogador:

Frontend (React - ArenaCampanha)
↓ HTTP POST /api/campanha/acao
Campaign Controller (Express)
↓
Campaign Service (Orquestrador)
↓
Engine de Campanha (resolverRodadaCampanha)
↓
Sistemas do Mundo (Mestre, Narrativa, Eventos, Agentes)
↓
Estado atualizado (Fonte da Verdade)
↓
Resposta JSON para o Frontend
↓
Re-render da UI com novo estado do mundo

🎮 27. Frontend da Campanha (ArenaCampanha.jsx)

Local:

frontend/src/pages/ArenaCampanha.jsx

Responsabilidades:

Exibir estado do mundo (rodada, tensão, crônicas)

Mostrar logs sistêmicos

Renderizar encontros perigosos

Enviar ações do jogador via API

Reagir ao estado retornado do servidor

Nunca realiza:

Cálculo de regras

Rolagem de dados

Lógica de narrativa

Processamento do mundo

A UI é apenas um visor do estado vivo da campanha.

📬 28. API da Campanha (Camada Mensageira)

Base route:

/api/campanha

Endpoints oficiais:

🏁 POST /api/campanha/iniciar

Cria um novo mundo vivo no servidor.

Retorna:

estadoCampanha (fonte da verdade)
campaignId
🎮 POST /api/campanha/acao ⭐ (NOVA CAMADA CRÍTICA)

Função:
Receber intenções do jogador e alimentar o cérebro da campanha.

Payload:

{
campaignId,
tipoAcao: 'explorar' | 'investigar' | 'observar' | 'descansar'
}

Processo interno:

Busca estado no campaignStore

Converte ação em histórico narrativo

Avança rodada global

Processa mundo via engine

Retorna estado atualizado

🔄 POST /api/campanha/rodada

Modo debug/sandbox para avanço do mundo sem ação humana.

🗂 29. Campaign Controller (Tradução de Intenções)

Arquivo:

src/controllers/campaignController.js

Responsabilidade arquitetural:

Validar requisições HTTP

Traduzir ações da UI em linguagem do sistema

Alimentar histórico de ações

Delegar processamento ao CampaignService

Regra fundamental:

Controller não executa regras do jogo.

🧭 30. Campaign Service (Orquestrador do Mundo Vivo)

Arquivo:

src/services/campaignService.js

Funções críticas:

Avançar rodadaGlobal (tempo do mundo)

Orquestrar engine de campanha

Detectar gatilhos de combate

Integrar combate sistêmico automático

Retornar estado consolidado

Fluxo interno:

Avançar tempo do mundo
→ resolverRodadaCampanha()
→ verificar gatilhoCombate
→ iniciar combate (se necessário)
→ retornar estadoCampanha

Princípio mantido:

O Service orquestra, mas não contém regras mecânicas.

🧱 31. Campaign Store (Memória Viva do Servidor)

Arquivo:

src/services/campaignStore.js

Função:
Armazenar campanhas ativas em memória.

Características:

Fonte única da verdade do mundo

Multi-campanhas simultâneas

Estado persistente entre requisições HTTP

Independente do frontend

Fluxo:

UI nunca guarda estado do mundo
→ Servidor guarda
→ UI apenas sincroniza
🎩 32. Integração com o Mestre da Campanha (IA Sistêmica)

Ordem de processamento após ação do jogador:

historicoAcoes
→ interpretarHistoricoAcoes
→ sistemaMestreCampanha
→ sistemaConsequencias
→ sistemaEventosDinamicos
→ sistemaNarrativaDinamica

Isso garante:

Avaliação orgânica das ações

Narrativa emergente

Reação sistêmica coerente

⚔️ 33. Gatilho Automático de Combate (Campanha → Combate)

Quando:

estadoCampanha.gatilhoCombate.status === 'pendente'

Fluxo:
CampaignService
→ Seleciona inimigo via tabela do mundo
→ combatService.iniciarCombate()
→ Atualiza logMundo
→ Retorna combateIniciado = true

Arquitetura preservada:

A campanha NÃO executa combate diretamente.
Apenas gera gatilhos sistêmicos.

🧬 34. Sincronização de Estado em Tempo Real

Modelo adotado:
State Pull Reativo

A cada ação:

Backend processa mundo completo

Retorna estadoCampanha atualizado

Frontend faz re-render total do estado

Vantagens:

Determinismo

Debug fácil

Testabilidade

Escalabilidade multiplayer futura

🛡 35. Garantias Arquiteturais Mantidas Após Integração Web

✔ Engine continua pura (sem HTTP)
✔ UI não conhece regras
✔ Backend é o cérebro do mundo
✔ Estado centralizado no servidor
✔ Logs continuam como narrativa oficial
✔ Combate desacoplado via gatilho sistêmico
✔ Campanha agora é jogável em tempo real

🎯 Nova Síntese Arquitetural (Atualizada)

Seu sistema evoluiu para:

Um RPG Sandbox Online com:

Engine determinística (Node)

Mundo vivo persistente (Store)

API mensageira (Express)

Interface reativa (React)

Mestre sistêmico avaliando ações humanas

Narrativa emergente baseada em estado real

Arquitetura conceitual final:

🧠 Engine do Mundo
→ 📡 API Mensageira
→ 🖥️ Interface Interativa
→ 🎮 Jogador
→ 🧠 Mundo reage organicamente
📡 26.5 — Router da Campanha (Camada de Entrada HTTP)
🧭 Papel do Router na Arquitetura

Arquivo:

src/routes/campaignRoutes.js

O Router representa a porta oficial de comunicação entre o Frontend e o Cérebro do Mundo (Backend).

Ele NÃO contém:

Regras do jogo

Lógica de narrativa

Processamento do mundo

Alteração direta do estado

Função exclusiva:

Mapear intenções HTTP para controladores da campanha.

🌐 Posição do Router na Arquitetura Geral

Fluxo completo atualizado:

Frontend (React - ArenaCampanha)
↓ HTTP Request
Router (Express Routes)
↓
Controller (Tradução de Intenção)
↓
Service (Orquestrador do Mundo)
↓
Engine de Campanha (Regras Puras)
↓
Estado do Mundo (Fonte da Verdade)
↓
Resposta JSON → Frontend Reativo

O Router é a camada de roteamento semântica entre UI e sistema.

🗂 27. Estrutura do Router da Campanha

Arquivo:

src/routes/campaignRoutes.js

Implementação conceitual:

router.post('/iniciar', campaignController.iniciarCampanha);
router.post('/acao', campaignController.executarAcaoCampanha);
router.post('/rodada', campaignController.processarRodada);

Cada rota representa uma intenção sistêmica do jogador ou do mundo.

🎮 28. Rotas Oficiais da Campanha (Contrato da API)
🏁 POST /api/campanha/iniciar

Responsabilidade:
Criar um novo mundo vivo no servidor.

Fluxo:
Router → Controller.iniciarCampanha → Store → Estado inicial

Características:

Gera estadoCampanha

Registra no campaignStore

Retorna fonte da verdade para o frontend

🎮 POST /api/campanha/acao ⭐ (Rota Crítica do Sistema)

Responsabilidade:
Receber ações do jogador e alimentar o sistema orgânico da campanha.

Payload esperado:

{
"campaignId": "string",
"tipoAcao": "explorar | investigar | observar | descansar"
}

Fluxo arquitetural:
Router
→ Controller.executarAcaoCampanha
→ Registro em historicoAcoes
→ CampaignService.processarRodada
→ Engine + Mestre da Campanha
→ Estado atualizado

Importante:

A ação não altera o mundo diretamente.
Ela apenas registra a intenção que será interpretada pela engine.

🔄 POST /api/campanha/rodada

Responsabilidade:
Avançar o mundo sem ação humana (modo sandbox/debug).

Uso principal:

Testes automatizados

Simulações

Campanhas autônomas

Debug do sistema macro

🧠 29. Integração do Router com o Server Principal

Arquivo:

src/server.js

Registro arquitetural:

app.use('/api/campanha', campaignRoutes);

Isso cria o namespace sistêmico:

/api/campanha/\*

Separando semanticamente:

/api/combates → micro engine

/api/campanha → macro engine do mundo

🧱 30. Princípio Arquitetural do Router (Design Limpo)

Garantias mantidas no seu projeto:

✔ Router não conhece engine
✔ Router não conhece regras
✔ Router não manipula estado
✔ Router não executa narrativa
✔ Router apenas direciona intenções

Isso preserva a pureza da engine e o desacoplamento total do sistema.

🔁 31. Diferença Arquitetural: Router vs Controller

Camada | Responsabilidade | Conhece Regras?
Router | Mapeamento de rotas HTTP | ❌ Não
Controller | Tradução de intenções | ❌ Não
Service | Orquestração do mundo | ⚠️ Indiretamente
Engine | Regras do jogo | ✔ Sim

Essa separação é avançada e correta para sistemas sandbox complexos.

🌍 32. Impacto do Router no Mundo Vivo da Campanha

Antes (CLI):
Jogador → função direta → engine

Agora (Web):
Jogador → Frontend → Router → Controller → Service → Engine

Isso permite:

Multiplayer futuro

Persistência remota

Sincronização de estado

Interface reativa em tempo real

Escalabilidade de campanhas online

🎯 Atualização da Síntese Arquitetural (VERSÃO FINAL)

Nova cadeia oficial do seu RPG Sandbox:

🧠 Engine do Mundo (Regras Puras)
↑
🎩 Campaign Service (Orquestrador)
↑
🎮 Campaign Controller (Tradução de Intenções)
↑
📡 Campaign Router (Porta HTTP da Campanha)
↑
🖥️ Frontend React (ArenaCampanha)
↑
👤 Jogador

💎 Observação técnica (nível profissional)

Do jeito que você estruturou:

/api/campanha
/api/combates

Você criou uma separação arquitetural EXCELENTE entre:

Micro Sistema (Combate)

Macro Sistema (Campanha)
