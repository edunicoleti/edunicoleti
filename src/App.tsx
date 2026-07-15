import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Mentoria from './pages/Mentoria'
import Proposta from './pages/Proposta'
import PropostaPDF from './pages/PropostaPDF'
import PropostaDashboard from './pages/PropostaDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mentoria" element={<Mentoria />} />
      <Route path="/proposta/:slug" element={<Proposta />} />
      <Route path="/proposta/:slug/pdf" element={<PropostaPDF />} />
      <Route path="/propostas" element={<PropostaDashboard />} />
    </Routes>
  )
}
