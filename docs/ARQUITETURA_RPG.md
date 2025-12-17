Visão Geral

Este projeto implementa um sistema de RPG de mesa baseado em engine, com foco em:

clareza e transparência das regras

separação rigorosa de responsabilidades

facilidade de balanceamento e ajuste fino

persistência de estado via banco de dados

possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

rolagem de dados

ataque

defesa

cálculo de dano

estado do personagem

persistência em banco

Essa separação permite testes isolados, simulações e evolução gradual do sistema.

Filosofia do Sistema
Princípios Fundamentais

Ataque e defesa são entidades distintas

Defesa depende exclusivamente do defensor

Ataque resolve o confronto completo (incluindo dano)

O dano nunca é negativo

Toda aleatoriedade vem de um único módulo

Regras de jogo não conhecem o banco de dados

O banco existe apenas para persistir estado

O jogo acontece em memória

Camadas do Sistema
Banco de Dados (SQLite)
↓
Services (personagensService, mesaPersonagensService)
↓
Game Engine (combat, rules, dice)
↓
Resultado do Turno / Combate
↓
Persistência de Estado

Módulo de Dados (dice.js)

Responsável por toda a aleatoriedade do sistema.

Nenhuma outra parte do projeto gera números aleatórios diretamente.

Funções

jogarDado(lados)

jogarVariosDados(qtd, lados)

jogarDadoComBonus(lados, bonus)

checarDificuldade(testes, lados, dificuldade, bonus)

Esse módulo garante:

previsibilidade para testes

facilidade de balanceamento

possibilidade futura de “seed” ou replay de combates

Modelo de Defesa
Conceito

Funções defensivas:

recebem apenas o personagem defensor

realizam a rolagem de dado

somam atributos defensivos

retornam um valorDefesa

A defesa não conhece o atacante.

Interface conceitual
defesa(personagem) => {
tipo,
rolagem,
valorDefesa,
descricao
}

Defesas implementadas

defesaFisica

esquivar

resistirMagia

resistirVeneno

defesaFugir

A defesa de fuga pode encerrar o combate sem dano.

Modelo de Ataque
Conceito

O ataque é responsável por resolver todo o confronto, recebendo:

o atacante

o objeto de ataque (arma ou magia)

a função de defesa escolhida pelo defensor

o defensor

O ataque:

executa a rolagem

calcula o valor ofensivo

chama a defesa

calcula o dano final

Interface conceitual
ataque(atacante, ataque, defesaFn, defensor) => {
ataque: { ... },
defesa: { ... },
resultado: {
diferenca,
danoCausado
}
}

Dano
dano = max(0, valorAtaque - valorDefesa)

O sistema não possui dano negativo.

Ações de Desafio (Não Combate)

Algumas regras representam ações ambientais, não ataques diretos:

atravessarRio

escalarMuro

abrirPortaAntiga

Essas ações:

calculam uma dificuldade

utilizam checarDificuldade

retornam sucesso ou falha

não causam dano direto

Engine de Combate (combatDb.js)

O módulo combatDb.js é o orquestrador do combate.

Responsabilidades:

buscar personagens no banco

mapear estado persistente → estado de jogo

executar turnos de combate

aplicar dano em memória

persistir estado final no banco

O engine:

não contém regras

não acessa SQL diretamente

não decide atributos

Ele apenas coordena.

Persistência e Banco de Dados
Princípios

O banco armazena estado

O jogo opera em memória

O estado é salvo após eventos relevantes

Exemplo de fluxo

personagensService.buscarPorId

combate ocorre em memória

personagensService.atualizarVida

O banco nunca interfere nas regras.

Modelo de Personagem
Banco (personagens)

id

nome

pontosDeVida

forca

resistencia

agilidade

inteligencia

(expansível: sorte, vigor, poder, etc.)

Jogo (memória)
{
...personagem,
vida: pontosDeVida
}

Essa separação evita acoplamento entre engine e persistência.

Playground e Testes

A pasta playground é usada para:

testes manuais

simulações

seed de banco

validação de arquitetura

Código de playground:

pode criar personagens

pode rodar combates

não é código de produção

Integração com API

Endpoints REST (Express):

usam services

chamam a engine (combat)

retornam resultados

Exemplo futuro:

POST /mesas/:id/combate

Próximos Passos Planejados

Combate baseado em mesa_personagens

Ordem de iniciativa

Estados: inconsciente, ferido grave, morto

Balanceamento de atributos

Testes automatizados

IA narrativa

Conclusão

Este projeto prioriza:

arquitetura limpa

clareza conceitual

separação de responsabilidades

evolução incremental

O sistema já permite:

simulações reais

persistência de campanha

testes de balanceamento

A base está sólida para expansão futura.
