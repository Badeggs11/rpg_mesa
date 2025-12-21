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
export async function criarPersonagem(dados) {
  const res = await fetch("/personagens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.erro || "Erro ao criar o personagem");
  }

  return json;
}
