import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Mentoria from './pages/Mentoria'

/* Rotas de proposta em chunks próprios: não pesam na Home nem na /mentoria */
const Proposta = lazy(() => import('./pages/Proposta'))
const PropostaPDF = lazy(() => import('./pages/PropostaPDF'))
const PropostaDashboard = lazy(() => import('./pages/PropostaDashboard'))

/* Painel financeiro pessoal (protegido por senha, noindex) */
const Financeiro = lazy(() => import('./pages/Financeiro'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentoria" element={<Mentoria />} />
        <Route path="/proposta/:slug" element={<Proposta />} />
        <Route path="/proposta/:slug/pdf" element={<PropostaPDF />} />
        <Route path="/propostas" element={<PropostaDashboard />} />
        <Route path="/financeiro" element={<Financeiro />} />
      </Routes>
    </Suspense>
  )
}
