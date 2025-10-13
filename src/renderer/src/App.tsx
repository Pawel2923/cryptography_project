import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/home'
import AlgorithmsPage from './pages/algorithms'
import ResultPage from './pages/result'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/encrypt" replace />} />
      <Route path="/encrypt" element={<HomePage />} />
      <Route path="/decrypt" element={<HomePage />} />
      <Route path="/encrypt/algorithms" element={<AlgorithmsPage operation="encrypt" />} />
      <Route path="/decrypt/algorithms" element={<AlgorithmsPage operation="decrypt" />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  )
}

export default App
