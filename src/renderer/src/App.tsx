import { Route, Routes } from 'react-router'
import HomePage from './pages/home'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage activePage="encrypt" />} />
      <Route path="/decrypt" element={<HomePage activePage="decrypt" />} />
    </Routes>
  )
}

export default App
