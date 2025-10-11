import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/home'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/encrypt" replace />} />
      <Route path="/encrypt" element={<HomePage />} />
      <Route path="/decrypt" element={<HomePage />} />
    </Routes>
  )
}

export default App
