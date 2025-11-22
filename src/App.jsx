import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Goals from './pages/Goals';
import Resources from './pages/Resources';
import Tools from './pages/Tools';
import Community from './pages/Community';
import Habits from './pages/Habits';
import Inspiration from './pages/Inspiration';
import Productivity from './pages/Productivity';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800 flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/community" element={<Community />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/productivity" element={<Productivity />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;