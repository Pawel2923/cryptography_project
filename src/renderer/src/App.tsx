import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/home'
import AlgorithmsPage from './pages/algorithms'
import AlgorithmPage from './pages/algorithm'
import ResultPage from './pages/result'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/encrypt" replace />} />
      <Route path="/encrypt" element={<HomePage />} />
      <Route path="/decrypt" element={<HomePage />} />
      <Route path="/encrypt/algorithms" element={<AlgorithmsPage operation="encrypt" />} />
      <Route path="/decrypt/algorithms" element={<AlgorithmsPage operation="decrypt" />} />
      <Route path="/encrypt/algorithm/:id" element={<AlgorithmPage operation="encrypt" />} />
      <Route path="/decrypt/algorithm/:id" element={<AlgorithmPage operation="decrypt" />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  )
}

export default App
