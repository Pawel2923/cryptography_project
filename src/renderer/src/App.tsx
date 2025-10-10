import { Link, Route, Routes } from 'react-router'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <p>Hello World</p>
            <Link to="/about">About</Link>
          </div>
        }
      />
      <Route path="/about" element={<p>About Us</p>} />
    </Routes>
  )
}

export default App
