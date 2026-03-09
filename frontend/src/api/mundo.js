export async function obterMapa() {
  const res = await fetch('/api/mundo/mapa');

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao carregar mapa');
  }

  return data.mapa;
}
