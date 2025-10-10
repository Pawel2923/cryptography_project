import { Route, Routes } from 'react-router'
import HomePage from './pages/home'
import DecryptPage from './pages/decrypt'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/decrypt" element={<DecryptPage />} />
    </Routes>
  )
}

export default App
