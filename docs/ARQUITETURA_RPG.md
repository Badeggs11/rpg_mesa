ARQUITETURA — RPG de Mesa (Engine + API + Frontend)

Este documento descreve a arquitetura atual e consolidada do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), bem como o fluxo de dados entre essas camadas após a implementação completa do CRUD de personagens e do editor de atributos.

Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine própria, com backend e frontend integrados, com foco em:

clareza e transparência das regras

separação rigorosa de responsabilidades

facilidade de balanceamento e ajuste fino

persistência de estado via banco de dados

visualização e interação explícita pelo usuário

possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

rolagem de dados

iniciativa

ataque

defesa

cálculo de dano

estado do personagem

persistência em banco

exposição via API

consumo via frontend

Essa separação permite testes isolados, simulações controladas, integração incremental e evolução segura do sistema.

Filosofia do Sistema
Princípios Fundamentais

Ataque e defesa são entidades distintas

Defesa depende exclusivamente do defensor

Ataque resolve o confronto completo (incluindo dano)

O dano nunca é negativo

Toda aleatoriedade vem de um único módulo (dice.js)

Regras de jogo não conhecem banco de dados nem HTTP

Engine não conhece SQL, Express ou frontend

O banco existe apenas para persistir estado

O jogo acontece em memória

Frontend nunca acessa o banco diretamente

Esses princípios evitam acoplamento indevido e facilitam manutenção, testes e expansão.

Camadas do Sistema (Atual)
Frontend (React + Vite)
↓ HTTP (JSON)
Backend API (Express)
↓
Controllers
↓
Services
↓
Game Engine (rules, engine, dice)
↓
Estado em Memória
↓
Persistência (SQLite)

Observações Importantes

Controllers lidam exclusivamente com req e res

Services orquestram persistência + engine

Services atuam como camada de tradução de domínio

Engine é pura (sem HTTP, sem banco)

Frontend consome a API via fetch

Proxy do Vite integra frontend/backend sem CORS

Nenhuma camada “pula” a camada abaixo

Organização de Pastas (Backend)
rpg_mesa/
└─ src/
├─ controllers/
│ ├─ combatController.js
│ └─ personagensController.js
│
├─ routes/
│ ├─ combatRoutes.js
│ └─ personagensRoutes.js
│
├─ services/
│ ├─ combatService.js
│ └─ personagensService.js
│
├─ database/
│ └─ db.js
│
├─ game/
│ ├─ dice.js
│ ├─ rules.js
│ ├─ engine/
│ │ ├─ iniciativa.js
│ │ ├─ resolverAtaque.js
│ │ ├─ resolverDefesa.js
│ │ ├─ resolverDesafio.js
│ │ └─ combateTurnos.js
│ │
│ ├─ world/
│ │ ├─ armas/
│ │ │ └─ espadas.js
│ │ ├─ poderes/
│ │ │ └─ fogo.js
│ │ └─ index.js
│ │
│ └─ tests/
│ ├─ testeCombateTurnos.js
│ └─ testeEngineAtaque.js
│
├─ rpg.db
└─ server.js

Persistência e Tradução de Domínio (Importante)
Banco de Dados

O banco SQLite mantém nomes técnicos e estáveis, como:

pontosDeVida

Domínio do Sistema

O restante do sistema (engine, frontend, API) utiliza:

vida

Regra Arquitetural

A tradução entre vida ↔ pontosDeVida acontece exclusivamente no personagensService.

Controllers falam a linguagem do sistema (vida)

Engine fala apenas vida

Frontend fala apenas vida

O banco nunca “vaza” seus nomes para fora

Isso funciona como uma camada anti-corrupção, protegendo o domínio do jogo de detalhes de persistência.

Frontend (React + Vite)

O frontend é responsável por:

listar personagens

criar personagens

editar atributos de personagens

iniciar combates

conduzir escolhas explícitas de ataque e defesa

visualizar logs e estados do combate

Estrutura Atual
frontend/
└─ src/
├─ api/
│ ├─ combate.js
│ └─ personagens.js
│
├─ pages/
│ ├─ ListarPersonagens.jsx
│ ├─ CriarPersonagem.jsx
│ ├─ EditarPersonagem.jsx
│ └─ ArenaCombate.jsx
│
├─ components/
│ └─ log/
│ └─ Log.jsx
│
├─ App.jsx
└─ main.jsx

Rotas do Frontend

/ → Listagem de personagens

/criar-personagem → Criação de personagem

/editar-personagem → Editor de atributos de personagem

/arena → Arena de combate

As rotas do frontend não precisam espelhar as rotas da API.

API — Rotas REST
Personagens
GET /personagens
POST /personagens
PUT /personagens/:id
DELETE /personagens/:id

Combate
POST /api/combate/iniciar
POST /api/combate/acao

Integração Frontend ↔ Backend

O frontend não utiliza URLs públicas diretamente.

O Vite Proxy redireciona chamadas automaticamente:

fetch('/personagens')
fetch('/api/combate/iniciar')

⬇️

http://localhost:3000/personagens
http://localhost:3000/api/combate/iniciar

Isso evita problemas de:

CORS

HTTPS

ambientes locais e Codespaces

Módulo de Dados — dice.js

Responsável por toda a aleatoriedade do sistema.

Nenhuma outra parte do projeto gera números aleatórios diretamente.

Funções

jogarDado(lados)

jogarVariosDados(qtd, lados)

jogarDadoComBonus(lados, bonus)

checarDificuldade(testes, lados, dificuldade, bonus)

Garantias

previsibilidade para testes

balanceamento centralizado

possibilidade futura de seed / replay

Regras do Jogo — rules.js

O módulo rules.js descreve ações, mas não executa.

Ele é responsável por:

calcular valores base

combinar atributos do personagem

combinar parâmetros de armas ou poderes

definir defesas permitidas

Ele nunca:

rola dados

acessa banco

aplica dano

conhece HTTP

Cada função retorna um objeto de regra declarativa, que será executado pela engine.

Engine de Jogo — game/engine

A engine executa as regras descritas e controla o fluxo do combate.

Componentes

iniciativa.js

resolverAtaque.js

resolverDefesa.js

resolverDesafio.js

combateTurnos.js

Responsabilidades

rolar iniciativa

controlar fases do combate

executar ataques e defesas

aplicar bônus percentuais (dado como protagonista)

calcular dano

permitir fuga como encerramento

gerar log estruturado e transparente

A engine é totalmente desacoplada de banco, API e frontend.

Fluxo Real de Combate
Frontend inicia combate
↓
POST /api/combate
↓
Engine resolve turnos em memória
↓
Service persiste vida final
↓
Frontend exibe resultado

Estado Atual do Projeto

Atualmente o sistema já permite:

✔️ CRUD completo de personagens

✔️ Editor visual de atributos

✔️ combate por turnos com iniciativa

✔️ execução faseada (iniciativa → ataque → defesa)

✔️ rolagem de dados controlada pelo usuário

✔️ integração rules → engine → frontend

✔️ logs ricos e explicáveis

✔️ engine testável de forma isolada

Próximos Passos Planejados

Biblioteca de golpes (personagem + arma + intenção)

Seleção dinâmica de personagens na Arena

Seleção de armas no frontend

Visualização detalhada de cálculos

Estados de personagem (ferido, inconsciente, morto)

Balanceamento fino

Testes automatizados

IA narrativa

Conclusão

Este projeto prioriza:

arquitetura limpa

separação rigorosa de responsabilidades

aprendizado real (não apenas código copiado)

evolução incremental

O sistema funciona de ponta a ponta, possui:

engine de combate por turnos interativa

rolagem explícita de dados

editor completo de personagens

contrato sólido entre camadas

e está preparado para crescer sem refatorações traumáticas.

flowchart TD
UI[Frontend<br/>React + Vite]
API[Backend API<br/>Express]
C[Controllers]
S[Services]
E[Game Engine<br/>rules · engine · dice]
M[Estado do Jogo<br/>Em Memória]
DB[(SQLite<br/>Persistência)]

    UI -->|HTTP JSON| API
    API --> C
    C --> S
    S --> E
    E --> M
    S --> DB
