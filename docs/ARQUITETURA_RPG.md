ARQUITETURA — RPG de Mesa (Engine + API + Frontend)

Este documento descreve a arquitetura atual do projeto rpg_mesa, incluindo engine de jogo, backend (API + banco) e frontend (React), bem como o fluxo de dados entre essas camadas.

Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine, com backend e frontend integrados, com foco em:

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

Esses princípios evitam acoplamento indevido e facilitam manutenção e expansão.

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

Proxy do Vite é usado para integração frontend/backend

Organização de Pastas (Backend)
rpg_mesa/
└─ src/
├─ controllers/
│ ├─ personagensController.js
│ ├─ mesasController.js
│ ├─ mesaPersonagensController.js
│ └─ combatController.js
│
├─ routes/
│ ├─ personagensRoutes.js
│ ├─ mesasRoutes.js
│ ├─ mesaPersonagensRoutes.js
│ └─ combatRoutes.js
│
├─ services/
│ ├─ personagensService.js
│ ├─ mesasService.js
│ ├─ mesaPersonagensService.js
│ └─ combatService.js
│
├─ database/
│ └─ db.js
│
├─ game/
│ ├─ dice.js
│ ├─ rules.js
│ ├─ engine/
│ │ ├─ executarAcao.js
│ │ ├─ resolverAtaque.js
│ │ ├─ resolverDefesa.js
│ │ ├─ resolverDesafio.js
│ │ ├─ iniciativa.js
│ │ └─ combateTurnos.js
│ │
│ ├─ world/
│ │ ├─ ambientes/
│ │ │ ├─ rios.js
│ │ │ └─ muros.js
│ │ ├─ armas/
│ │ │ └─ espadas.js
│ │ ├─ poderes/
│ │ │ └─ fogo.js
│ │ └─ index.js
│ │
│ └─ tests/
│ ├─ testeCombateTurnos.js
│ ├─ testeCombate.js
│ └─ testeEngineAtaque.js
│
├─ rpg.db
└─ server.js

Frontend (React + Vite)

O frontend é responsável por visualizar, criar e interagir com os elementos do sistema.

Estrutura do Frontend (Atual)
frontend/
└─ src/
├─ api/
│ ├─ personagens.js
│ └─ combate.js
│
├─ pages/
│ ├─ ListaPersonagens.jsx
│ ├─ CriarPersonagem.jsx
│ └─ ArenaCombate.jsx
│
├─ App.jsx
└─ main.jsx

Funcionalidades do Frontend

✔️ Criação de personagens via formulário controlado
✔️ Validação de campos e feedback visual
✔️ Integração direta com API (POST /personagens)
✔️ Listagem de personagens persistidos
✔️ Início de combate via API
✔️ Exibição de resultados de combate

🔮 Planejado: execução do combate turno a turno, onde cada rolagem de dado será disparada por ações do usuário (botões).

Integração Frontend ↔ Backend

O frontend não usa URLs públicas diretamente

O Vite Proxy redireciona chamadas para o backend

Exemplo
fetch("/personagens")

É redirecionado internamente para:

http://localhost:3000/personagens

Isso evita problemas de CORS e HTTPS em ambientes locais e remotos (Codespaces).

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

Ele pode:

calcular valores base

usar atributos do personagem

definir defesas permitidas

Ele nunca:

rola dados

acessa banco

aplica dano

conhece HTTP

Engine de Jogo — game/engine

A engine executa as regras descritas e controla o fluxo do combate.

Componentes

iniciativa.js

resolverAtaque.js

resolverDefesa.js

resolverDesafio.js

combateTurnos.js

Responsabilidades

rolar iniciativa com bônus apenas no dado

alternar turnos de ataque e defesa

resolver ataques e defesas

calcular dano

permitir fuga como condição de encerramento

gerar log estruturado de cada turno

A engine é totalmente desacoplada de banco, API e frontend.

Persistência e Banco de Dados
Princípios

SQLite armazena estado persistente

Combates acontecem em memória

Apenas o resultado final é salvo

Exemplo de Fluxo Real
Frontend cria personagem
↓
POST /personagens
↓
SQLite persiste dados
↓
Frontend lista personagens

Frontend inicia combate
↓
POST /api/combate
↓
Engine resolve combate por turnos em memória
↓
Vida final é persistida
↓
Frontend exibe resultado

Estado Atual do Projeto

Atualmente o sistema já permite:

✔️ criar personagens no banco via frontend
✔️ visualizar personagens criados
✔️ listar personagens no frontend
✔️ executar combate real com engine
✔️ combate por turnos com iniciativa
✔️ permitir fuga ou morte como desfecho
✔️ persistir vida após combate
✔️ visualizar resultados no frontend
✔️ testar a engine de forma isolada

Próximos Passos Planejados

Seleção de atacante e defensor no frontend

Combate turno a turno com interação do usuário

Visualização detalhada de rolagens de dados

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

O sistema já funciona de ponta a ponta, possui engine de combate por turnos validada por testes, e está preparado para crescer sem refatorações traumáticas.
