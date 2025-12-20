export async function listarPersonagens() {
  const res = await fetch("/personagens", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao listar personagens");
  }

  return res.json();
}
