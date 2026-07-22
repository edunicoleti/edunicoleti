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

/* CRM — funil de vendas (protegido por senha, noindex) */
const Crm = lazy(() => import('./pages/Crm'))

/* Rota desconhecida cai numa 404 real, não numa tela em branco */
const NotFound = lazy(() => import('./pages/NotFound'))

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
        <Route path="/crm" element={<Crm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
