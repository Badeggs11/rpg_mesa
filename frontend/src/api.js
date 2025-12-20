const API_BASE =
  "https://redesigned-robot-5pqgrvq6wvj3p7qr-3000.app.github.dev";

export async function executarCombate(payload) {
  const res = await fetch("/api/combate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || "Erro no combate");
  }
  return data;
}
