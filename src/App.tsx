import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Proposta from './pages/Proposta'
import PropostaDashboard from './pages/PropostaDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/proposta/:slug" element={<Proposta />} />
      <Route path="/propostas" element={<PropostaDashboard />} />
    </Routes>
  )
}
