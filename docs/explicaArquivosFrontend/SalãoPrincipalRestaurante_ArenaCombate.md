🧠 O que é combate?
const [combate, setCombate] = useState(null);

Esse é o estado oficial da tela.

Quando você faz:

setCombate(data)

👉 React renderiza de novo
👉 JSX muda
👉 Tela muda

State = coisa que o React observa.

🧠 O que é combateRef?
const combateRef = useRef(null);

Isso cria:

combateRef = { current: null }

É só uma caixa de memória persistente.

React NÃO observa

Mudar .current NÃO renderiza

É invisível pra UI

🔗 Onde nasce o LINK entre eles?

Aqui:

useEffect(() => {
combateRef.current = combate;
}, [combate]);

Tradução:

"Toda vez que o estado combate mudar, copia ele para dentro da caixa combateRef."

Então:

combate (state) → efeito → combateRef.current

Não é automático. Você criou o vínculo manualmente.

🧩 O que é isso?
useEffect(() => {
combateRef.current = combate;
}, [combate]);

Essa estrutura tem 3 partes:

O que é
useEffect Sistema de efeitos colaterais do React
() => { ... } A ação que será executada
[combate] Lista de dependências (o gatilho)
🧠 O que é o [combate]?

Isso é a lista de dependências.

Significa:

“React, execute esse efeito sempre que o valor de combate mudar.”

Não é “quando renderiza”.
É quando o valor anterior é diferente do novo.

🎯 React faz isso internamente:
valor antigo de combate !== valor novo de combate ?
→ SIM → roda o useEffect
→ NÃO → ignora

1️⃣ React guarda novo combate
2️⃣ React renderiza a tela com o novo combate
3️⃣ Depois da renderização → React roda os useEffects
4️⃣ Esse efeito copia o combate para combateRef.current

O useEffect não sincroniza a tela.
Ele sincroniza uma memória interna invisível com o estado que já foi renderizado.

Por que isso é necessário?

Por causa disso:

const acaoDoBotaoDado = useCallback(() => {
const c = combateRef.current;
}, []);

Essa função foi criada uma única vez.
Ela não recebe o combate novo automaticamente.

Então o efeito faz:

Estado novo → coloca dentro da caixa (ref)
Função antiga → lê da caixa
📦 Diferença visual clara
Coisa O que faz
setCombate() Muda UI
useEffect(..., [combate]) Atualiza memória auxiliar
combateRef.current Armazena versão mais recente

💡 Regra de ouro

Dependências controlam quando o efeito roda.
Effect roda depois da renderização.
Refs são memória, não UI.

🧠 Essa função cria o quê?
function criarEstadoInicial(p1, p2) { ... } localizada no combateTurnos, backend

Ela cria o objeto estado, que depois vira:

const combate = { // isso no combatService, backend
id: uuid(),
...estado
}

👉 Esse combate é exatamente o que o frontend recebe e guarda aqui:

const [combate, setCombate] = useState(null);

Então sim:

criarEstadoInicial → cria o combate que a UI vive lendo

🏗 O que essa função está fazendo?

Ela não cria só dados. Ela cria um modelo físico da luta.

1️⃣ Primeiro ela “higieniza” os jogadores
const fix = p => ({
...p,
controlador: p.controlador || 'humano',
pontosDeVida: Number.isFinite(p.pontosDeVida) ? p.pontosDeVida : 0,
stamina: Number.isFinite(p.stamina) ? p.stamina : 0,
percepcao: Number.isFinite(p.percepcao) ? p.percepcao : 0,
});

Isso é um sistema de segurança:

Problema Correção feita
valor undefined vira 0
jogador sem controlador vira humano
número inválido vira 0

👉 Garante que o engine nunca receba lixo.

2️⃣ Depois ela cria o estado base da luta
return {
tempoLimite: null,
tipoTempo: null,
turno: 0,
atacanteAtual: null,
defensorAtual: null,
personagens: { ... }
}

Isso é como se você estivesse criando:

📄 Ficha do combate

Campo Significado
tempoLimite segundos da janela de ação
tipoTempo ataque ou defesa
turno número do turno
atacanteAtual quem está agindo
defensorAtual quem está reagindo
personagens dados vivos dos jogadores
3️⃣ Isso vira o objeto combate

Depois no service:

const combate = {
id: uuid(),
...estado,
}

Agora ele ganha:

🆔 Identidade própria
📦 Persistência
🔁 Controle de vida útil

🎮 Fluxo completo
Personagem do banco
↓
criarEstadoInicial()
↓
estado
↓
adiciona id
↓
combatStore.criarCombate()
↓
API retorna combate
↓
Frontend recebe
↓
setCombate()
↓
UI começa a viver esse objeto
🧠 Insight importante

Esse objeto não é só “dados”.

Ele é:

✔ estado da máquina de estados
✔ memória da luta
✔ log histórico
✔ fonte da UI
✔ fonte das regras

🧱 1. <Log /> → O QUE ISSO É?

Isso não é HTML.
Isso é um componente React.

Lá em cima você fez:

import Log from '../components/log/Log';

Então o React entende que:

<Log />

significa:

“Execute a função Log() e desenhe o que ela retornar.”

Ou seja, você está chamando outro “mini-programa de tela”.

📦 2. eventos= → ISSO É UMA PROP

Em React, quando você escreve:

<AlgumaCoisa nomeDaProp={valor} />

Você está passando um dado para o componente.

Então aqui:

eventos={combate.log}

significa:

“Log, estou te entregando um dado chamado eventos.”

⚠️ O nome eventos não é aleatório.
Ele precisa bater com o que o componente Log espera.

Lá dentro do Log.jsx deve ter algo assim:

export default function Log({ eventos }) {

Esse { eventos } é a variável que recebe o que você enviou.

Se você mudasse para:

<Log historia={combate.log} />

Então o Log teria que ser:

function Log({ historia })

O nome precisa combinar.

🧠 3. {combate.log} → POR QUE TEM CHAVES?

No JSX:

Forma Significa
texto="abc" string literal
valor={algo} expressão JavaScript

Então:

eventos={combate.log}

quer dizer:

“Use o valor real da variável combate.log.”

Sem as chaves seria só texto:

eventos="combate.log" ❌

Com chaves:

eventos={combate.log} ✅

Você está passando o array de eventos do estado.

📜 4. O QUE É combate.log?

Lembra do seu engine?

estado.log.push({ tipo: 'ataque', ... })

Esse log é uma lista tipo:

[
{ tipo: 'iniciativa', valor: 14 },
{ tipo: 'ataque', atacante: 'Jake', golpe: 'socoSimples' },
{ tipo: 'dano', valor: 12 }
]

Isso chega ao frontend como:

combate.log

E você entrega isso ao narrador (Log.jsx).

🎭 5. O QUE O Log FAZ COM ISSO?

Dentro do Log.jsx, provavelmente:

eventos.map(e => { ... })

Ele percorre a lista e transforma cada evento em:

texto

animação

dado rolando

Ele pega dados mecânicos e vira narrativa visual.

🔄 RESUMO DA LINHA
<Log eventos={combate.log} />

Tradução humana:

“React, execute o componente Log e entregue para ele a lista de eventos do combate para que ele transforme isso na história da luta.”

🧩 PAPEL DE CADA PARTE
Parte O que é
Log Componente React (arquivo Log.jsx)
eventos Nome da prop (precisa bater com o Log.jsx)
{} Diz que é JavaScript, não texto
combate.log A lista de eventos gerada pelo engine
🎯 Em UMA frase

Essa linha é o fio que liga o cérebro do jogo ao narrador da batalha.

Sem ela, o combate acontece… mas ninguém vê a história.
