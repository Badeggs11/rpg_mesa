🧩 ARQUITETURA — RPG de Mesa

Engine + API + Frontend

Este documento descreve a arquitetura atual e consolidada do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), bem como o fluxo de dados entre essas camadas após a implementação completa do sistema de combate faseado com visualização 3D de dados.

✅ Funcionalidades Implementadas

CRUD completo de personagens

Editor visual de atributos

Sistema de combate por turnos

Execução faseada do turno (iniciativa → ataque → defesa → resolução)

Mecânica de stamina

Ataques consecutivos baseados em iniciativa extra

Logs estruturados, narrativos e explicáveis

Padronização de contrato de personagem (pontosDeVida, stamina, etc.)

Visualização 3D fiel de rolagem de dados (D20) ✅

Sincronização entre lógica da engine e tempo visual do frontend ✅

📌 Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine própria, com backend e frontend integrados, priorizando:

clareza e transparência das regras

separação rigorosa de responsabilidades

facilidade de balanceamento

persistência de estado

visualização explícita do funcionamento interno do jogo

possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

rolagem de dados

iniciativa

ataque

defesa

cálculo de dano

consumo de stamina

ataques consecutivos

estado do personagem

persistência em banco

exposição via API

consumo via frontend

Essa separação permite testes isolados, simulações controladas e evolução segura do sistema.

🧠 Filosofia do Sistema
Princípios Fundamentais

Ataque e defesa são entidades distintas

Defesa depende exclusivamente do defensor

O confronto final (dano) é resolvido no orquestrador do turno

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

Controllers lidam exclusivamente com req e res

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

garantir a ordem correta das fases:

rolagem de iniciativa

definição do primeiro atacante

rolagem de ataque

escolha de golpe e direção

rolagem de defesa

resolução do turno

aplicar regras de stamina

decidir ataques consecutivos

gerar logs estruturados e semanticamente ricos

Nenhuma outra parte do sistema decide o fluxo do combate.

Responsabilidades do combateTurnos

Manter o estado do turno

Garantir consistência entre fases

Executar regras de ataque, defesa e dano

Centralizar toda aleatoriedade (via dice.js)

Produzir logs completos e explicáveis

Não conhecer UI, HTTP ou persistência

🎮 Frontend — Arena de Combate (ArenaCombate.jsx)
Papel Arquitetural

O ArenaCombate.jsx atua como o orquestrador da experiência do jogador, não das regras.

Ele:

interpreta a fase atual do combate

exibe apenas os controles permitidos naquela fase

envia ações explícitas para a API

nunca decide regras

nunca calcula dano

nunca rola dados

Responsabilidades do ArenaCombate

Renderizar controles conforme a fase (combate.fase)

Sincronizar inputs do jogador com a engine

Manter UI previsível e segura

Garantir que nenhuma ação inválida seja enviada

O ArenaCombate é uma máquina de interface, não de regras.

🎲 Visualização de Dados — D20 3D (Frontend)
Objetivo

Fornecer uma representação visual fiel, didática e transparente da rolagem de dados, sem interferir na lógica da engine.

Implementação

Componente: DadoD20Three.jsx

Tecnologia: Three.js (WebGL)

Executado exclusivamente no frontend

Não gera números aleatórios

Apenas visualiza resultados já calculados pela engine

Responsabilidades do Componente

Exibir um D20 tridimensional sólido

Animar a rolagem por tempo configurável

Garantir que o valor sorteado pare na face correta

Destacar visualmente a face vencedora

Sincronizar animação com logs textuais

Nunca influenciar regras ou estado do jogo

Garantias Arquiteturais

O valor exibido é imutável

A engine continua sendo a única fonte de verdade

O dado é puramente representacional

Pode ser removido sem impacto na lógica

📜 Logs de Combate

Os logs:

são gerados exclusivamente pela engine

possuem significado semântico (não são strings soltas)

permitem:

animações sincronizadas

narração rica

futura integração com IA narradora

O frontend apenas interpreta o tempo e a visualização desses logs.

📈 Estado Atual do Projeto

O sistema já permite:

✔ Combate por turnos completo
✔ Execução faseada controlada
✔ Visualização 3D fiel de dados
✔ Mecânica de stamina e risco
✔ Ataques consecutivos com iniciativa extra
✔ Logs narrativos e explicáveis
✔ Engine isolável e testável
✔ Frontend previsível e seguro

🏁 Conclusão

Este projeto demonstra:

domínio real de arquitetura

separação clara entre regra, estado e visualização

decisões técnicas conscientes

evolução incremental sem dívida técnica

O sistema está coerente, estável e pronto para crescer.
