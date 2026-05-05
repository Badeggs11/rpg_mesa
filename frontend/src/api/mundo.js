export async function obterMapa() {
  const res = await fetch('/api/mundo/mapa');

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar mapa');
  }

  return data.mapa;
}

export async function obterLugarDetalhado(localId) {
  const res = await fetch(`/api/mundo/lugares/${localId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar lugar detalhado');
  }

  return data.lugar;
}

export async function obterSentimento(sentimentoId) {
  const res = await fetch(`/api/mundo/sentimentos/${sentimentoId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar sentimento');
  }

  return data.sentimento;
}

export async function obterDesejo(desejoId, fomeAtual) {
  const res = await fetch(
    `/api/mundo/desejos/${desejoId}?fomeAtual=${fomeAtual}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar desejo');
  }

  return data.desejo;
}

export async function obterEfeitoFome(jogador, fomeAtual) {
  const params = new URLSearchParams({
    fomeAtual: String(fomeAtual ?? 12),
    forca: String(jogador?.forca ?? 0),
    agilidade: String(jogador?.agilidade ?? 0),
    resistencia: String(jogador?.resistencia ?? 0),
    percepcao: String(jogador?.percepcao ?? 0),
    percepcaoVisual: String(jogador?.percepcaoVisual ?? 0),
    inteligencia: String(jogador?.inteligencia ?? 0),
    stamina: String(jogador?.stamina ?? 0),
  });

  const res = await fetch(`/api/mundo/efeitos/fome?${params.toString()}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar efeito da fome');
  }

  return data.efeito;
}
