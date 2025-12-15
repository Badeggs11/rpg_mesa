# ARQUITETURA – RPG de Mesa (Engine)

## Visão Geral

Este projeto implementa um sistema de RPG de mesa com foco em:

- clareza de regras
- modularidade
- facilidade de balanceamento
- possibilidade futura de uso com IA

O sistema separa claramente:

- ataque
- defesa
- rolagem de dados
- cálculo de dano
- consequências narrativas

---

## Filosofia do Sistema

### Princípios

- Ataque e defesa são entidades separadas
- Defesa depende apenas do defensor
- Ataque resolve o confronto completo (incluindo dano)
- Dano nunca é negativo
- Toda aleatoriedade vem de um único módulo (`dice.js`)

---

## Módulo de Dados (`dice.js`)

Responsável por TODA rolagem aleatória do sistema.

Funções principais:

- `jogarDado(lados)`
- `jogarVariosDados(qtd, lados)`
- `jogarDadoComBonus(lados, bonus)`
- `checarDificuldade(testes, lados, dificuldade, bonus)`

Nenhuma outra parte do sistema gera números aleatórios diretamente.

---

## Modelo de Defesa

### Conceito

Funções defensivas:

- recebem apenas o personagem defensor
- rolam dado
- somam atributos defensivos
- retornam um `valorDefesa`

### Interface conceitual

```js
defesa(personagem) => {
  tipo,
  rolagem,
  valorDefesa,
  descricao
}
```
