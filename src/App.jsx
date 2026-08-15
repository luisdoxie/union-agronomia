import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CasosEspeciales from './pages/CasosEspeciales';
import PlanEstudio from './pages/PlanEstudio';
import Horarios from './pages/Horarios';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="casos-especiales" element={<CasosEspeciales />} />
        <Route path="plan-estudio" element={<PlanEstudio />} />
        <Route path="horarios" element={<Horarios />} />
      </Route>
    </Routes>
  );
}
