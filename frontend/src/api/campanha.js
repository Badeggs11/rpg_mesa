export async function iniciarCampanha(payload = {}) {
  const res = await fetch('/api/campanha/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro ao iniciar campanha');

  return data;
}

export async function executarAcaoCampanha(payload) {
  const res = await fetch('/api/campanha/acao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.erro || 'Erro ao executar ação na campanha');

  return data;
}

export async function avancarRodadaCampanha(payload) {
  const res = await fetch('/api/campanha/rodada', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro ao avançar rodada');

  return data;
}
