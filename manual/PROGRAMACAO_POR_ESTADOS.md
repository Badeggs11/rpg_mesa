O que é Programação por Estados
🧠 Definição Simples (para entendimento imediato)

Programação por Estados é um modelo de programação onde o sistema funciona com base em uma única pergunta central:

“Em que estado o sistema está agora?”

E não:

“Qual função eu devo executar agora?”

Ou seja, em vez de pensar apenas em ações isoladas, o sistema passa a ser guiado por situações estruturadas chamadas de estados.

🎭 Exemplo Mental Intuitivo

Imagine um semáforo:

Estados possíveis:

Verde

Amarelo

Vermelho

O comportamento do sistema muda conforme o estado:

Se está Verde → carros passam

Se está Amarelo → atenção

Se está Vermelho → carros param

O código não precisa perguntar mil coisas.
Ele só precisa saber:

estadoAtual = "vermelho"

E agir de acordo com isso.

Isso é programação por estados.

🏛️ Origem Histórica da Programação por Estados

A base conceitual vem de um campo da ciência da computação chamado:

Máquinas de Estados Finitos (Finite State Machines – FSM)

Esse conceito surgiu formalmente nos anos 1940–1950, com estudos de:

John von Neumann (arquitetura computacional)

Alan Turing (modelos de computação)

Teoria dos Autômatos (Automata Theory)

Inicialmente, era usado para:

Circuitos eletrônicos

Sistemas de controle

Linguagens formais

Compiladores

Robótica

Ou seja: sistemas que precisam reagir ao contexto atual.

⚙️ Evolução na Engenharia de Software

Com o tempo, a programação por estados passou a ser usada em:

Sistemas embarcados (aviões, carros, elevadores)

Interfaces gráficas (UI)

Jogos digitais (principalmente RPGs e jogos táticos)

Inteligência Artificial de NPCs

Sistemas complexos com múltiplas fases

Hoje, é considerada uma abordagem madura para sistemas complexos e previsíveis.

🎮 Por que Jogos usam Programação por Estados (muito!)

Jogos são, por natureza, sistemas baseados em estados.

Exemplos clássicos:

Personagem: idle, correndo, atacando, morto

Jogo: menu, pausa, combate, exploração

Inimigo: patrulha, alerta, ataque

Sem estados, o código vira um caos de if/else desorganizados.

Com estados, o sistema fica:

previsível

testável

modular

mais fácil de evoluir

🧩 Diferença entre Programação Tradicional e por Estados
🪵 Programação Tradicional (procedural)

Foco:

executarFuncao()
depoisOutraFuncao()
depoisOutra()

Fluxo rígido e linear.

🧠 Programação por Estados (state-driven)

Foco:

if (estado === "tempoDeAtaque") {
executarLogicaDeAtaque();
}

O fluxo depende do contexto atual do sistema.

📦 Estrutura Fundamental de um Sistema por Estados

Todo sistema baseado em estados possui:

Estado atual

Transições de estado

Regras por estado

Eventos que mudam o estado

Exemplo genérico:

estado = {
fase: "tempoDeAtaque"
}

Depois:

switch (estado.fase) {
case "tempoDeAtaque":
// lógica de ataque
break;
case "tempoDeDefesa":
// lógica de defesa
break;
}

🎯 Ligação Direta com o SEU RPG (rpg_mesa)

Seu projeto é um exemplo clássico de programação por estados.

No Combate:
estado = {
fase: "tempoDeAtaque",
turno: 3,
atacanteAtual: "Jake"
}

O engine decide tudo com base na fase.

Na Campanha:
estadoCampanha = {
rodadaGlobal: 1,
faseCampanha: "cicloJogadores",
jogadorDaVez: "j1"
}

O mundo evolui com base no estado, não em timers ou funções soltas.
