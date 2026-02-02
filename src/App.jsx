import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analysis from "./pages/Analysis";
import About from "./pages/About";
import Tools from "./pages/Tools";

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Analysis />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </main>
      </Router>
    </>
  )
}

export default App
