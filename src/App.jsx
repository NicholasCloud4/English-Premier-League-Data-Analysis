import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Tools from "./pages/Tools";
import Events from "./pages/Events";

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/about" replace />} /> */}
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </main>
      </Router>
    </>
  )
}

export default App
