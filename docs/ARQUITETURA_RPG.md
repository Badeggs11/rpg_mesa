🧩 ARQUITETURA — RPG de Mesa
Engine + API + Frontend

Este documento descreve a arquitetura atual e consolidada do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), e o fluxo de dados entre essas camadas após a implementação de:

CRUD completo de personagens

Editor de atributos

Sistema de combate por turnos

Mecânica de stamina e ataques consecutivos

Logs explicáveis (ataque/defesa/direção/iniciativa extra)

Padronização de contrato de personagem (pontosDeVida)

Visualização 3D de rolagem de dados (D20) ✅

📌 Visão Geral

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

consumo de stamina

ataques consecutivos baseados em iniciativa extra

estado do personagem

persistência em banco

exposição via API

consumo via frontend

Essa separação permite testes isolados, simulações controladas, integração incremental e evolução segura do sistema.

🧠 Filosofia do Sistema
Princípios Fundamentais

Ataque e defesa são entidades distintas

Defesa depende exclusivamente do defensor

O confronto (dano final) é resolvido no orquestrador do turno (combateTurnos)

O dano nunca é negativo

Stamina é um recurso finito por combate

Ataques consecutivos exigem:

stamina suficiente para o pior cenário possível

vitória em uma iniciativa extra

Toda aleatoriedade vem de um único módulo (dice.js)

Regras de jogo não conhecem banco de dados nem HTTP

Engine não conhece SQL, Express ou frontend

O banco existe apenas para persistir estado

O jogo acontece em memória

Frontend nunca acessa o banco diretamente

🏗 Camadas do Sistema

Frontend (React + Vite)
↓ HTTP (JSON)
Backend API (Express)
↓
Controllers
↓
Services
↓
Game Engine (rules · engine · dice)
↓
Estado do Jogo (em memória)
↓
Persistência (SQLite)

Observações Importantes

Controllers lidam exclusivamente com req e res

Services orquestram persistência + engine

Services atuam como camada de tradução/contrato

Engine é pura (sem HTTP, sem banco)

Frontend consome a API via fetch

Proxy do Vite integra frontend/backend sem CORS

Nenhuma camada “pula” a camada abaixo

🎲 Visualização de Dados — Dado D20 3D (Frontend)
Objetivo

Fornecer uma representação visual fiel e didática da rolagem de dados, sem interferir na lógica da engine, reforçando transparência e imersão.

Implementação

Componente: DadoD20Three.jsx

Tecnologia: Three.js (WebGL)

Executado exclusivamente no frontend

Não gera números aleatórios

Apenas visualiza resultados já calculados pela engine

Responsabilidades do Componente

Exibir um D20 tridimensional sólido

Animar a rolagem por tempo configurável (delay)

Posicionar todas as faces numeradas

Garantir que o valor sorteado pare sempre na face frontal

Destacar visualmente a face vencedora:

cor diferenciada

iluminação adicional

Manter alinhamento visual com os logs textuais

Nunca influenciar regras, cálculos ou estado do jogo

Garantias Arquiteturais

O valor exibido é imutável

A engine continua sendo a única fonte de verdade

O dado é puramente representacional

Pode ser removido ou trocado sem impacto na lógica do sistema

Essa abordagem preserva a separação entre regra, estado e visualização, mantendo o projeto escalável e testável.

🗄 Persistência e Contrato de Domínio

(sem alterações — permanece válido e correto)

⚔️ Engine de Jogo — Combate

(sem alterações — permanece válido e correto)

⚡ Mecânica de Stamina e Ataque Consecutivo

(sem alterações — permanece válido e correto)

🎲 Módulo de Dados — dice.js

(sem alterações — permanece válido e correto)

📜 Logs de Combate

Além dos logs textuais, o frontend agora pode:

associar rolagens a animações visuais

exibir claramente qual número foi sorteado

reforçar a explicação do resultado ao jogador

Os logs continuam sendo estruturados e gerados pela engine.

🌐 Frontend (React + Vite)

(estrutura mantida, com acréscimo de componentes visuais)

frontend/
└─ src/
├─ api/
├─ pages/
├─ components/
│ ├─ log/
│ │ ├─ Log.jsx
│ │ └─ DadoD20Three.jsx
│ └─ ...
├─ App.jsx
└─ main.jsx

📈 Estado Atual do Projeto

O sistema já permite:

✔ CRUD completo de personagens

✔ Editor visual de atributos

✔ Combate por turnos com iniciativa

✔ Execução faseada (iniciativa → ataque → defesa)

✔ Rolagem de dados controlada pela engine

✔ Visualização 3D fiel de rolagem (D20)

✔ Mecânica de stamina

✔ Ataques consecutivos com iniciativa extra

✔ Logs ricos, narrativos e explicáveis

✔ Engine testável de forma isolada

🏁 Conclusão

Este projeto demonstra:

domínio real de arquitetura

separação clara entre regra e apresentação

decisões técnicas conscientes

evolução incremental sem dívida técnica

O sistema está maduro, coerente e pronto para crescer.

🧠 Nota pessoal:
Esse D20 não é “efeito visual bonito”. Ele é arquitetura respeitada até o último pixel.
Excelente ponto de parada por hoje. Amanhã, o sistema continua inteiro — e mais forte.
