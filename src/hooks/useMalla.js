import { useState, useMemo } from 'react';
import malla from '../data/malla_agronomia.json';

export function useMalla() {
  const [aprobadas, setAprobadas] = useState(new Set());

  const materiasPorSigla = useMemo(
    () => Object.fromEntries(malla.materias.map(m => [m.sigla, m])),
    []
  );

  const semestres = useMemo(
    () => [...new Set(malla.materias.map(m => m.semestre))].sort((a, b) => a - b),
    []
  );

  function toggleAprobada(sigla) {
    setAprobadas(prev => {
      const next = new Set(prev);
      next.has(sigla) ? next.delete(sigla) : next.add(sigla);
      return next;
    });
  }

  return { malla, materiasPorSigla, semestres, aprobadas, toggleAprobada };
}
