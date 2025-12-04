import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/home'
import AlgorithmsPage from './pages/algorithms'
import AlgorithmPage from './pages/algorithm'
import ResultPage from './pages/result'
import KeyExchangePage from './pages/key-exchange'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/encrypt" replace />} />
      <Route path="/encrypt" element={<HomePage />} />
      <Route path="/decrypt" element={<HomePage />} />
      <Route path="/key-exchange" element={<KeyExchangePage />} />
      <Route path="/encrypt/algorithms" element={<AlgorithmsPage operation="encrypt" />} />
      <Route path="/decrypt/algorithms" element={<AlgorithmsPage operation="decrypt" />} />
      <Route path="/encrypt/algorithm/:id" element={<AlgorithmPage operation="encrypt" />} />
      <Route path="/decrypt/algorithm/:id" element={<AlgorithmPage operation="decrypt" />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  )
}

export default App
