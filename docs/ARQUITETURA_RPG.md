🧩 ARQUITETURA — RPG de Mesa

Engine + API + Frontend

Este documento descreve a arquitetura atual e consolidada do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), bem como o fluxo de dados entre essas camadas após a implementação do sistema de combate faseado com sincronização visual de dados.

✅ Funcionalidades Implementadas

CRUD completo de personagens

Editor visual de atributos

Sistema de combate por turnos

Execução faseada do turno

iniciativa → ataque → defesa → resolução

Mecânica de stamina com:

consumo por ataque

recuperação passiva ao defender

limite máximo configurável (100)

Ataques consecutivos baseados em:

stamina mínima necessária (pior cenário)

vitória em iniciativa extra

Logs estruturados, narrativos e explicáveis

Padronização de contrato de personagem

pontosDeVida, stamina, resistencia, etc.

Visualização 3D fiel de rolagem de dados (D20)

Sincronização precisa entre engine e tempo visual do frontend

Separação rigorosa entre regra, estado e apresentação

📌 Visão Geral

O projeto implementa um sistema de RPG de mesa baseado em engine própria, priorizando:

clareza e transparência das regras

separação rigorosa de responsabilidades

previsibilidade de estado

facilidade de balanceamento

visualização explícita do funcionamento interno do jogo

possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

rolagem de dados

iniciativa

ataque

defesa

cálculo de dano

consumo e recuperação de stamina

ataques consecutivos

estado do personagem

persistência em banco

exposição via API

consumo via frontend

Essa separação permite testes isolados, simulações controladas e evolução segura.

🧠 Filosofia do Sistema
Princípios Fundamentais

Ataque e defesa são entidades distintas

Defesa depende exclusivamente do defensor

O confronto final (dano) é resolvido no orquestrador do turno

O dano nunca é negativo

Stamina é um recurso finito e estratégico

Ataques consecutivos exigem:

stamina suficiente para o pior cenário possível

vitória em uma iniciativa extra

O defensor recupera stamina a cada rodada de defesa

Toda aleatoriedade vem de um único módulo (dice.js)

Regras de jogo não conhecem banco de dados nem HTTP

Engine não conhece SQL, Express ou frontend

O banco apenas persiste estado

O jogo acontece em memória

O frontend nunca acessa o banco diretamente

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

Controllers lidam apenas com req e res

Services orquestram persistência + engine

Services atuam como camada de contrato

Engine é pura (sem HTTP, sem banco)

Frontend consome a API via fetch

Proxy do Vite integra frontend/backend sem CORS

Nenhuma camada “pula” outra camada

⚔️ Engine de Jogo — combateTurnos.js
Papel Central

O arquivo combateTurnos.js é o coração do sistema de combate.

Ele é responsável por:

controlar a máquina de estados do combate

garantir a ordem correta das fases

aplicar todas as regras de ataque, defesa e dano

gerenciar stamina (consumo e recuperação)

decidir ataques consecutivos

gerar logs estruturados e semanticamente ricos

Nenhuma outra parte do sistema decide o fluxo do combate.

Responsabilidades Principais (Resumo)

Manter o estado do turno

Garantir consistência entre fases

Centralizar toda aleatoriedade (dice.js)

Resolver completamente um turno

Produzir logs narrativos e explicáveis

Não conhecer UI, HTTP ou persistência

👉 Toda a verdade do combate vive aqui.

🎮 Frontend — Arena de Combate (ArenaCombate.jsx)
Papel Arquitetural

O ArenaCombate.jsx é o orquestrador da experiência do jogador, não das regras.

Ele:

interpreta a fase atual do combate

exibe apenas os controles permitidos naquela fase

envia ações explícitas para a API

nunca decide regras

nunca calcula dano

nunca rola dados

Responsabilidades (Resumo)

Renderizar controles conforme combate.fase

Sincronizar inputs do jogador com a engine

Garantir UI previsível e segura

Impedir ações inválidas

Exibir estado, status e logs do combate

👉 O ArenaCombate é uma máquina de interface, não uma engine.

🎲 Visualização de Dados — D20 3D (Frontend)
Objetivo

Fornecer uma representação visual fiel, didática e transparente da rolagem de dados, sem interferir na lógica da engine.

Implementação

Componente: DadoD20Three.jsx

Tecnologia: Three.js (WebGL)

Executado exclusivamente no frontend

Não gera números aleatórios

Apenas visualiza resultados já calculados pela engine

Garantias Arquiteturais

O valor exibido é imutável

A engine continua sendo a única fonte de verdade

O dado é puramente representacional

Pode ser removido sem impacto na lógica

📜 Logs de Combate

Logs são gerados exclusivamente pela engine

Não são strings soltas

Possuem significado semântico

Permitem:

animações sincronizadas

narração rica

futura integração com IA narradora

O frontend interpreta tempo e visualização, nunca o conteúdo.

📈 Estado Atual do Projeto

O sistema já permite:

✔ Combate por turnos completo
✔ Execução faseada controlada
✔ Visualização 3D fiel de dados
✔ Mecânica de stamina com risco e recuperação
✔ Ataques consecutivos com iniciativa extra
✔ Logs narrativos, explicáveis e sincronizados
✔ Engine isolável e testável
✔ Frontend previsível e seguro

🏁 Conclusão

Este projeto demonstra:

domínio real de arquitetura

separação clara entre regra, estado e visualização

decisões técnicas conscientes

evolução incremental sem dívida técnica

O sistema está coerente, estável e pronto para crescer.