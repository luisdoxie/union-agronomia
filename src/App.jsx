import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CasosEspeciales from './pages/CasosEspeciales';
import PlanEstudio from './pages/PlanEstudio';
import Horarios from './pages/Horarios';
import Noticias from './pages/Noticias';
import Buzon from './pages/Buzon';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="casos-especiales" element={<CasosEspeciales />} />
        <Route path="plan-estudio" element={<PlanEstudio />} />
        <Route path="horarios" element={<Horarios />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="buzon" element={<Buzon />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
