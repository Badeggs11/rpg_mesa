ARQUITETURA — RPG de Mesa (Engine + API + Frontend)

Este documento descreve a arquitetura atual do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), bem como o fluxo de dados entre essas camadas.

Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine própria, com backend e frontend integrados, com foco em:

clareza e transparência das regras

separação rigorosa de responsabilidades

facilidade de balanceamento e ajuste fino

persistência de estado via banco de dados

visualização e interação via frontend

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

Services orquestram banco + engine

Engine é pura (sem HTTP, sem banco)

Frontend consome a API via fetch

Proxy do Vite integra frontend/backend sem CORS

Organização de Pastas (Backend)
rpg_mesa/
└─ src/
├─ controllers/
│ └─ combatController.js
│
├─ routes/
│ └─ combatRoutes.js
│
├─ services/
│ └─ combatService.js
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

Frontend (React + Vite)

O frontend é responsável por visualizar, criar e interagir com os elementos do sistema, conduzindo explicitamente as ações do combate.

Estrutura Atual
frontend/
└─ src/
├─ api/
│ └─ combate.js
│
├─ pages/
│ └─ ArenaCombate.jsx
│
├─ App.jsx
└─ main.jsx

Funcionalidades Atuais

✔️ Início de combate via API
✔️ Execução do combate fase a fase
✔️ Escolha explícita de ataque e defesa
✔️ Rolagem de dados acionada pelo usuário (botão 🎲)
✔️ Visualização de turnos, fases e participantes
✔️ Log detalhado e estruturado de cada evento

🔮 Planejado:

seleção dinâmica de personagens

escolha de armas e golpes

visualização gráfica de rolagens

Integração Frontend ↔ Backend

O frontend não utiliza URLs públicas diretamente.

O Vite Proxy redireciona chamadas automaticamente:

fetch('/api/combate/iniciar')

⬇️

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

Persistência e Banco de Dados
Princípios

SQLite armazena estado persistente

Combates acontecem em memória

Apenas o resultado final é salvo

Fluxo Real
Frontend inicia combate
↓
POST /api/combate
↓
Engine resolve turnos em memória
↓
Vida final é persistida
↓
Frontend exibe resultado

Estado Atual do Projeto

Atualmente o sistema já permite:

✔️ combate por turnos com iniciativa
✔️ execução faseada (iniciativa → ataque → defesa)
✔️ rolagem de dados controlada pelo usuário
✔️ integração rules → engine → frontend
✔️ logs ricos e explicáveis
✔️ engine testável de forma isolada

Próximos Passos Planejados

Biblioteca de golpes (personagem + arma + intenção)

Seleção de arma no frontend

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

O sistema já funciona de ponta a ponta, possui engine de combate por turnos interativa, com rolagem explícita de dados, e está preparado para crescer sem refatorações traumáticas.
