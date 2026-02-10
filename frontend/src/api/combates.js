export async function iniciarCombate(payload) {
  const res = await fetch('/api/combates/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro ao iniciar combate');

  return data;
}

export async function executarAcaoCombate(payload) {
  const res = await fetch('/api/combates/acao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro ao executar ação');

  return data;
}
