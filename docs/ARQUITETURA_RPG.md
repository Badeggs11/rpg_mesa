# 🧩 ARQUITETURA — RPG de Mesa

## Engine + API + Frontend

Este documento descreve a arquitetura atual e consolidada do projeto `rpg_mesa`, incluindo engine de jogo, backend (API + banco) e frontend (React), e o fluxo de dados entre essas camadas após a implementação de:

- CRUD completo de personagens
- Editor de atributos
- Sistema de combate por turnos
- Mecânica de stamina e ataques consecutivos
- Logs explicáveis (ataque/defesa/direção/iniciativa extra)
- Padronização de contrato de personagem (pontosDeVida)

---

## 📌 Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine própria, com backend e frontend integrados, com foco em:

- clareza e transparência das regras
- separação rigorosa de responsabilidades
- facilidade de balanceamento e ajuste fino
- persistência de estado via banco de dados
- visualização e interação explícita pelo usuário
- possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

- rolagem de dados
- iniciativa
- ataque
- defesa
- cálculo de dano
- consumo de stamina
- ataques consecutivos baseados em iniciativa extra
- estado do personagem
- persistência em banco
- exposição via API
- consumo via frontend

Essa separação permite testes isolados, simulações controladas, integração incremental e evolução segura do sistema.

---

## 🧠 Filosofia do Sistema

### Princípios Fundamentais

- Ataque e defesa são entidades distintas
- Defesa depende exclusivamente do defensor
- O confronto (dano final) é resolvido no orquestrador do turno (combateTurnos)
- O dano nunca é negativo
- Stamina é um recurso finito por combate
- Ataques consecutivos exigem:
  - stamina suficiente para o pior cenário possível
  - vitória em uma iniciativa extra
- Toda aleatoriedade vem de um único módulo (`dice.js`)
- Regras de jogo não conhecem banco de dados nem HTTP
- Engine não conhece SQL, Express ou frontend
- O banco existe apenas para persistir estado
- O jogo acontece em memória
- Frontend nunca acessa o banco diretamente

---

## 🏗 Camadas do Sistema

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

### Observações Importantes

- Controllers lidam exclusivamente com `req` e `res`
- Services orquestram persistência + engine
- Services atuam como camada de tradução/contrato
- Engine é pura (sem HTTP, sem banco)
- Frontend consome a API via fetch
- Proxy do Vite integra frontend/backend sem CORS
- Nenhuma camada “pula” a camada abaixo

---

## 📁 Organização de Pastas (Backend)

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
│ │ ├─ golpesAtaque.js  
│ │ ├─ golpesDefesa.js  
│ │ └─ index.js  
│ │  
│ └─ tests/  
│ ├─ testeCombateTurnos.js  
│ └─ testeEngineAtaque.js  
│  
├─ rpg.db  
└─ server.js

---

## 🗄 Persistência e Contrato de Domínio

### Banco de Dados

O SQLite mantém nomes técnicos e estáveis, como:

- `pontosDeVida`
- `stamina`
- `percepcao`

### Domínio do Sistema (Contrato Atual)

O projeto padronizou o contrato de personagem usando:

- `pontosDeVida` (padronizado no frontend, backend e engine)
- `stamina`
- `percepcao`
- `forca`, `agilidade`, `resistencia`, `inteligencia`

### Regra Arquitetural

O contrato deve ser consistente entre camadas:

- O frontend envia e recebe `pontosDeVida`
- A API expõe `pontosDeVida`
- A engine calcula e atualiza `pontosDeVida`
- O banco persiste `pontosDeVida`

Isso evita bugs de “vida sumindo” e elimina traduções inconsistentes entre `vida` vs `pontosDeVida`.

---

## ⚔️ Engine de Jogo — Combate

### Fluxo de Combate

- Rolagem de Iniciativa
- Ataque (escolha de golpe + direção)
- Defesa (escolha de golpe + direção)
- Resolução (dano + stamina)
- Verificação de ataque consecutivo (iniciativa extra)
- Próximo turno ou fim do combate

### Separação de Responsabilidades (Conserto importante)

- `resolverAtaque` calcula **apenas o valor bruto do ataque** (rolagem + intensidade)
- `resolverDefesa` calcula **apenas o valor bruto da defesa** e flags semânticas
- `combateTurnos` resolve o confronto e aplica dano:
  - defesa nunca é subtraída duas vezes
  - valores de ataque não podem ficar negativos por regra

### Semântica correta: Esquiva vs Bloqueio

- `evadiu` significa **esquiva perfeita**
- `evadiu` só pode ser `true` quando a defesa escolhida for do tipo `esquiva`
- Bloqueio nunca é narrado como esquiva

---

## ⚡ Mecânica de Stamina e Ataque Consecutivo

- Ao final de cada ataque:
  - o valor final do ataque é subtraído da stamina do atacante
- Para tentar ataque consecutivo:
  - precisa ter stamina suficiente para o pior cenário:
    - `20 + intensidade do golpe`
  - rola iniciativa extra (atacante vs defensor)
  - evento de log: `resultadoIniciativaExtra` (sucesso/fracasso)
  - se vencer, mantém o atacante no turno

Logs também podem narrar quando:

- o atacante falha na iniciativa extra
- o defensor assume o próximo ataque
- não há tentativa por stamina insuficiente

---

## 🎲 Módulo de Dados — dice.js

Responsável por toda a aleatoriedade do sistema.  
Nenhuma outra parte do projeto gera números aleatórios diretamente.

Funções:

- `jogarDado(lados)`
- `jogarVariosDados(qtd, lados)`
- `jogarDadoComBonus(lados, bonus)`
- `checarDificuldade(testes, lados, dificuldade, bonus)`

Garantias:

- previsibilidade para testes
- balanceamento centralizado
- possibilidade futura de seed / replay

---

## 📜 Logs de Combate

A engine gera logs estruturados e explicáveis, incluindo:

- rolagens de iniciativa (normal e extra)
- ataques e defesas
- direção escolhida na defesa vs direção real do ataque
- sucesso/falha de direção
- dano causado
- consumo de stamina
- tentativa e resultado de iniciativa extra (`resultadoIniciativaExtra`)
- fim do combate

O frontend apenas renderiza o log (sem lógica de jogo).

---

## 🌐 Frontend (React + Vite)

Responsabilidades:

- listar personagens
- criar personagens
- editar atributos (`pontosDeVida`, stamina, percepção, etc.)
- iniciar combates
- conduzir escolhas explícitas de ataque e defesa
- visualizar logs e estados do combate

Estrutura:
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

---

## 🔌 API — Rotas REST

### Personagens

- GET `/personagens`
- POST `/personagens`
- PUT `/personagens/:id`
- DELETE `/personagens/:id`

### Combate

- POST `/api/combate/iniciar`
- POST `/api/combate/acao`

---

## 🔄 Integração Frontend ↔ Backend

O frontend não utiliza URLs públicas diretamente.

O Vite Proxy redireciona chamadas automaticamente:

- `fetch('/personagens')`
- `fetch('/api/combate/iniciar')`

⬇️

- `http://localhost:3000/personagens`
- `http://localhost:3000/api/combate/iniciar`

Isso evita:

- CORS
- HTTPS
- diferenças entre ambientes locais e Codespaces

---

## 📈 Estado Atual do Projeto

O sistema já permite:

- ✔ CRUD completo de personagens (com contrato padronizado em `pontosDeVida`)
- ✔ Editor visual de atributos
- ✔ Combate por turnos com iniciativa
- ✔ Execução faseada (iniciativa → ataque → defesa)
- ✔ Rolagem de dados controlada pelo usuário
- ✔ Mecânica de stamina
- ✔ Ataques consecutivos baseados em iniciativa extra
- ✔ Logs ricos, narrativos e explicáveis
- ✔ Engine testável de forma isolada

---

## 🚀 Próximos Passos Planejados

- Biblioteca de golpes (personagem + arma + intenção)
- Seleção dinâmica de personagens na Arena
- Seleção de armas no frontend
- Visualização detalhada de cálculos
- Estados de personagem (ferido, inconsciente, morto)
- Balanceamento fino
- Testes automatizados
- IA narrativa

---

## 🏁 Conclusão

Este projeto prioriza:

- arquitetura limpa
- separação rigorosa de responsabilidades
- aprendizado real (não apenas código copiado)
- evolução incremental

O sistema funciona de ponta a ponta e está preparado para crescer sem refatorações traumáticas.
