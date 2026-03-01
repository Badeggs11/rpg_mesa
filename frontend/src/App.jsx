import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListarPersonagens from './pages/ListarPersonagens';
import CriarPersonagem from './pages/CriarPersonagem';
import EditarPersonagem from './pages/EditarPersonagem';
import ArenaCombate from './pages/ArenaCombate';
import ArenaCampanha from './pages/ArenaCampanha'; // 👈 NOVO

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListarPersonagens />} />
        <Route path="/criar-personagem" element={<CriarPersonagem />} />
        <Route path="/editar-personagem" element={<EditarPersonagem />} />
        <Route path="/arena" element={<ArenaCombate />} />
        {/* 🏚️ NOVA ROTA DA CAMPANHA */}
        <Route path="/campanha" element={<ArenaCampanha />} />
      </Routes>
    </BrowserRouter>
  );
}
