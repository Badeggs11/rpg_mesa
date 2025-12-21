import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListarPersonagens from "./pages/ListarPersonagens";
import CriarPersonagem from "./pages/CriarPersonagem";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListarPersonagens />} />
        <Route path="/criar-personagem" element={<CriarPersonagem />} />
      </Routes>
    </BrowserRouter>
  );
}
