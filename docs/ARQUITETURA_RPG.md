🧩 ARQUITETURA — RPG de Mesa

Engine + API + Frontend

📌 1. Visão do Sistema

O projeto implementa um sistema de RPG de mesa baseado em engine própria, priorizando:

clareza das regras

separação rigorosa de responsabilidades

previsibilidade de estado

visualização explícita do funcionamento interno

evolução segura e testável

O sistema separa explicitamente:

dados aleatórios · iniciativa · ataque · defesa · dano · stamina · ataques consecutivos · estado · persistência · API · visualização

🧠 2. Princípios Arquiteturais

Engine é pura (sem banco, HTTP ou UI)

Regras não conhecem infraestrutura

Estado do combate vive em memória

Banco apenas persiste

Frontend nunca acessa banco

Toda aleatoriedade vem de dice.js

Intenção vem de fora, regra vive dentro

🏗 3. Camadas do Sistema
Frontend (React)
↓ HTTP
API (Express)
↓
Controllers
↓
Services
↓
Engine (rules · engine · dice)
↓
Estado em memória
↓
SQLite (persistência)

⚔️ 4. Engine de Combate (combateTurnos.js)

Responsável por:

máquina de estados do combate

ordem das fases

regras de ataque/defesa/dano

consumo e recuperação de stamina

ataques consecutivos

geração de logs semânticos

👉 Toda a verdade do combate vive aqui.

🎮 5. Interface (ArenaCombate.jsx)

A UI:

interpreta combate.fase

exibe apenas controles válidos

envia intenções para a API

nunca calcula regras

Layout Atual
Esquerda Log mecânico (linha do tempo)
Direita Cena narrativa (visual)

Log = verdade mecânica
Cena = interpretação visual

🎮 6. Controle e Agentes
Controle Flutuante

Independente do layout

Arrastável

Pode ser ocultado

Camada de input sobreposta

Modelo de Controle

O sistema aceita três tipos de agentes:

Tipo Origem da intenção
Humano UI
CPU IA (decidirAcaoCpu.js)
Engine valida e resolve

A IA gera o mesmo payload que o frontend enviaria.

🎲 7. Visualização de Dados

O dado 3D:

executa apenas no frontend

não gera números

apenas visualiza resultados da engine

📜 8. Logs de Combate

gerados exclusivamente pela engine

estruturados semanticamente

permitem animação e narração

frontend controla apenas tempo e visualização

🧠 9. Garantias Arquiteturais

✔ Engine isolável e testável
✔ UI não decide regras
✔ IA não altera estado diretamente
✔ Logs são a fonte narrativa
✔ Layout não influencia regras

📈 10. Estado Atual do Projeto

✔ Combate por turnos completo
✔ Execução faseada
✔ D20 3D sincronizado
✔ Stamina estratégica
✔ Ataques consecutivos
✔ Log narrativo sincronizado
✔ Controle flutuante
✔ Suporte a CPU vs Humano
