# 📘 Event Schema — RPG de Mesa (rpg_mesa)

Este documento define o **Event Schema oficial** do projeto **rpg_mesa**.

O Event Schema é o **contrato de comunicação** entre a **Game Engine** e o **Frontend**, descrevendo
quais eventos existem, quais campos cada evento possui e o significado de cada campo.

Seu objetivo é garantir:

- clareza e previsibilidade dos logs
- separação rigorosa entre engine e interface
- facilidade para criação de interfaces visuais
- evolução segura do sistema sem refatorações traumáticas

---

## 🎯 Princípios Fundamentais

- Eventos são **narrativos**, não técnicos
- Eventos não expõem objetos internos da engine
- Eventos usam apenas tipos primitivos (`string`, `number`, enums simples)
- O Frontend **nunca interpreta regras ou cálculos**
- A Engine pode mudar internamente sem quebrar a UI

> **Estado é para a engine.  
> Evento é para o jogador.**

---

## 📌 Convenções Gerais

Todo evento possui obrigatoriamente o campo:

```ts
{
  tipo: string
}

{
    tipo: "iniciativa",
    iniciativaA: number,
    iniciativaB: number,
    primeiro: string
}
{
    tipo: "ataque",
    atacante: string,
    acao: "atacanteFisico" | "ataqueMagico",
    rolagem: number,
    valorAtaque: number
}

{
    tipo: "defesa",
    defensor: string,
    rolagem: number,
    valorDefesa: number,
    dano: number,
    vidaRestante: number
}

{
    tipo: "fimCombate",
    vencedor: string,
    derrotado: string
}
```
