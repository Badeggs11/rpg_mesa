import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListarPersonagens from './pages/ListarPersonagens';
import CriarPersonagem from './pages/CriarPersonagem';
import EditarPersonagem from './pages/EditarPersonagem';
import ArenaCombate from './pages/ArenaCombate';
import ArenaCampanha from './pages/ArenaCampanha'; // 👈 NOVO
import PaginaMapaCampanha from './pages/PaginaMapaCampanha';
import PaginaVisaoJogador from './pages/PaginaVisaoJogador';
import PaginaSentimentosJogador from './pages/PaginaSentimentosJogador';
import PaginaDesejosJogador from './pages/PaginaDesejosJogador';
import PaginaEfeitosJogador from './pages/PaginaEfeitosJogador';
import PaginaMemoriaJogador from './pages/PaginaMemoriaJogador';
import PaginaDialogoNPC from './pages/PaginaDialogoNPC';

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
        <Route path="/mapa" element={<PaginaMapaCampanha />} />
        <Route path="/visao" element={<PaginaVisaoJogador />} />
        <Route path="/sentimentos" element={<PaginaSentimentosJogador />} />
        <Route path="/desejos" element={<PaginaDesejosJogador />} />
        <Route path="/efeitos" element={<PaginaEfeitosJogador />} />
        <Route path="/memoria" element={<PaginaMemoriaJogador />} />
        <Route path="/dialogo-npc" element={<PaginaDialogoNPC />} />
      </Routes>
    </BrowserRouter>
  );
}
