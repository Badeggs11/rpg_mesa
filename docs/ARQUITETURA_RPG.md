# ARQUITETURA — RPG de Mesa (Engine)

## Visão Geral

Este projeto implementa um **sistema de RPG de mesa baseado em engine**, com foco em:

- clareza e transparência das regras
- separação rigorosa de responsabilidades
- facilidade de balanceamento e ajuste fino
- persistência de estado via banco de dados
- possibilidade futura de integração com IA narradora

O sistema separa explicitamente:

- rolagem de dados
- ataque
- defesa
- cálculo de dano
- estado do personagem
- persistência em banco

Essa separação permite **testes isolados**, **simulações controladas** e **evolução incremental** do sistema.

---

## Filosofia do Sistema

### Princípios Fundamentais

- Ataque e defesa são entidades distintas
- Defesa depende exclusivamente do defensor
- Ataque resolve o confronto completo (incluindo dano)
- O dano nunca é negativo
- Toda aleatoriedade vem de um único módulo
- Regras de jogo não conhecem o banco de dados
- O banco existe apenas para persistir estado
- O jogo acontece em memória

Esses princípios orientam toda a arquitetura e evitam acoplamentos indevidos.

---

## Camadas do Sistema

```
Banco de Dados (SQLite)
        ↓
Services (personagensService, mesasService, mesaPersonagensService)
        ↓
Game (dice, rules, engine)
        ↓
Resultado do Turno / Combate
        ↓
Persistência de Estado
```

### Observações

- Services fazem a ponte entre API, banco e engine
- A engine não conhece SQL nem controllers
- O estado é carregado do banco para memória antes da execução

---

## Organização de Pastas

```
rpg_mesa/
└─ src/
   ├─ controllers/
   │  ├─ mesaControllers.js
   │  ├─ mesaPersonagensControllers.js
   │  └─ personagensControllers.js
   │
   ├─ database/
   │  └─ db.js
   │
   ├─ game/
   │  ├─ dice.js
   │  ├─ rules.js
   │  ├─ engine/
   │  │  ├─ executarAcao.js
   │  │  ├─ resolverAtaque.js
   │  │  ├─ resolverDefesa.js
   │  │  └─ resolverDesafio.js
   │  │
   │  └─ tests/
   │     └─ testeCombate.js
   │
   ├─ routes/
   │  ├─ mesaPersonagensRoutes.js
   │  ├─ mesaRoutes.js
   │  └─ personagensRoutes.js
   │
   ├─ services/
   │  ├─ mesaPersonagensService.js
   │  ├─ mesasService.js
   │  └─ personagensService.js
   │
   ├─ rpg.db
   └─ server.js
```

---

## Módulo de Dados — `dice.js`

Responsável por **toda a aleatoriedade do sistema**.

Nenhuma outra parte do projeto gera números aleatórios diretamente.

### Funções

- `jogarDado(lados)`
- `jogarVariosDados(qtd, lados)`
- `jogarDadoComBonus(lados, bonus)`
- `checarDificuldade(testes, lados, dificuldade, bonus)`

### Garantias do Módulo

- previsibilidade para testes
- facilidade de balanceamento
- possibilidade futura de seed ou replay de combates

---

## Regras do Jogo — `rules.js`

O módulo `rules.js` **descreve ações**, mas **não executa resultados aleatórios**.

Ele pode:

- usar atributos do personagem
- calcular valores base determinísticos
- definir dificuldades

Ele nunca:

- rola dados
- decide sucesso final
- aplica dano
- acessa banco de dados

---

## Modelo de Defesa

### Conceito

Defesas são ações reativas e dependem **exclusivamente do defensor**.

Funções defensivas:

- recebem apenas o personagem defensor
- calculam um valor base determinístico
- declaram o dado utilizado

A defesa **não conhece o atacante**.

### Interface Conceitual

```
defesa(personagem) => {
  tipo,
  estilo,
  dado,
  base,
  descricao,
  limiarSucesso?
}
```

### Defesas Implementadas

- `defesaFisica`
- `esquivar`
- `resistirMagia`
- `resistirVeneno`
- `fugir`

A defesa de fuga pode encerrar o combate sem causar dano.

---

## Modelo de Ataque

### Conceito

O ataque descreve **como um confronto ofensivo funciona**, mas não executa a resolução final.

Ele recebe:

- o personagem atacante
- o objeto de ataque (arma ou magia)

O ataque define:

- dado de ataque
- valor base ofensivo
- defesas permitidas
- dado de dano

### Interface Conceitual

```
ataque(personagem, objeto) => {
  tipo,
  estilo,
  ataque: { dado, base },
  dano: { dado },
  defesaAlvo,
  descricao
}
```

---

## Dano

O dano é sempre calculado pela engine.

Regra fundamental:

```
dano = max(0, valorAtaque - valorDefesa)
```

O sistema não permite dano negativo.

---

## Ações de Desafio (Não Combate)

Algumas regras representam desafios ambientais:

- `atravessarRio`
- `escalarMuro`
- `abrirPortaAntiga`

Essas ações:

- calculam uma dificuldade
- usam o módulo de dados para rolagem
- retornam sucesso ou falha
- não causam dano direto

---

## Engine de Jogo — `game/engine`

A engine executa as ações descritas em `rules.js`.

Ela é composta por resolvers especializados:

- `resolverDesafio.js`
- `resolverDefesa.js`
- `resolverAtaque.js`
- `executarAcao.js`

### Responsabilidades da Engine

- rolar dados
- comparar ataque e defesa
- calcular dano
- produzir resultados

A engine:

- não contém regras
- não acessa banco
- não decide atributos

Ela apenas **coordena a execução**.

---

## Persistência e Banco de Dados

### Princípios

- O banco armazena estado
- O jogo opera em memória
- O estado é salvo após eventos relevantes

### Exemplo de Fluxo

1. `personagensService.buscarPorId`
2. combate ocorre em memória
3. `personagensService.atualizarVida`

O banco nunca interfere nas regras ou na engine.

---

## Modelo de Personagem

### Banco de Dados (`personagens`)

- id
- nome
- pontosDeVida
- forca
- resistencia
- agilidade
- inteligencia
- (expansível: sorte, vigor, poder, etc.)

### Jogo (Memória)

```
{
  ...personagem,
  vida: pontosDeVida
}
```

Essa separação evita acoplamento entre engine e persistência.

---

## Playground e Testes

A pasta `game/tests` é usada para:

- testes manuais
- simulações
- validação da arquitetura

Código de playground:

- pode criar personagens
- pode rodar combates
- não é código de produção

---

## Integração com API

Endpoints REST (Express):

- usam services
- chamam a engine
- retornam resultados

Exemplo futuro:

```
POST /mesas/:id/combate
```

---

## Próximos Passos Planejados

- Combate baseado em `mesa_personagens`
- Ordem de iniciativa
- Estados: inconsciente, ferido grave, morto
- Balanceamento de atributos
- Testes automatizados
- IA narrativa

---

## Conclusão

Este projeto prioriza:

- arquitetura limpa
- clareza conceitual
- separação de responsabilidades
- evolução incremental

A base atual já permite:

- simulações reais
- persistência de campanha
- testes de balanceamento

O sistema está sólido e preparado para expansão futura.
