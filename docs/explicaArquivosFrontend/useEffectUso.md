🌍 Conceito do useEffect

O useEffect é o gancho de efeitos colaterais do React.

Em português claro:

Ele diz ao React:
“Depois que a tela atualizar, executa isso aqui.”

React cuida da interface.
useEffect cuida do que acontece fora da interface.

🎬 Pense assim

Seu componente é um ator no palco.
O React cuida do roteiro (renderização).
O useEffect cuida do que acontece nos bastidores:

Buscar dados na internet

Começar um temporizador

Ouvir teclado/mouse

Conectar em API

Limpar coisas antigas

🧠 O problema que ele resolve

React atualiza a tela várias vezes.
Se você colocar código “normal” fora do useEffect, ele roda toda hora, sem controle.

O useEffect permite dizer:

🗣 “Só roda isso quando TAL COISA mudar.”

📦 Estrutura
useEffect(() => {
// código que será executado
}, [dependencias]);

Tem duas partes importantes:

Parte Função
Função interna O que deve acontecer
Array de dependências Quando isso deve acontecer
🧩 Os 3 jeitos principais de usar
1️⃣ Rodar sempre que renderiza
useEffect(() => {
console.log("Renderizou");
});

⚠️ Roda toda vez. Pouco usado assim.

2️⃣ Rodar uma única vez (modo "início do componente")
useEffect(() => {
console.log("Carregou a tela!");
}, []);

Array vazio = só na primeira vez.

🟢 Usado para:

Buscar dados da API

Iniciar jogo

Carregar personagens

Abrir conexão

3️⃣ Rodar quando algo mudar
useEffect(() => {
console.log("Vida do personagem mudou!");
}, [vida]);

Agora ele diz:

"Sempre que vida mudar, faz isso."

🎮 No seu projeto RPG isso vira:

Quando o combate muda de fase:

useEffect(() => {
setMostrarGolpes(false);
setGolpe(null);
}, [combate?.fase]);

Tradução:

"Sempre que a fase do combate mudar, reseta a seleção de golpe."

Isso é comportamento de reação ao estado. Exatamente o papel do useEffect.

🧹 O superpoder escondido: LIMPEZA

Ele também pode desligar coisas quando o componente sai de cena.

useEffect(() => {
const timer = setInterval(() => {
console.log("tic");
}, 1000);

return () => {
clearInterval(timer); // limpa quando sair
};
}, []);

Sem isso, seu app vira uma casa com torneiras abertas 🚿

🎨 Visual do fluxo
🔥 Resumo lendário
React faz useEffect faz
Desenha a tela Lida com o mundo externo
Mostra dados Busca dados
Atualiza UI Reage a mudanças
Estado muda Efeito acontece depois
🧠 Frase pra fixar

Render é o pensamento.
useEffect é a ação depois do pensamento.
