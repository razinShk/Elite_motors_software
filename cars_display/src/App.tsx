import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import ResourcesPage from './pages/resources/ResourcesPage';
import InventoryPage from './pages/inventory/InventoryPage';

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-[#F5F5F5] text-black overflow-hidden font-sans">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;