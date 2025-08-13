import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import KanbanBoard from './pages/KanbanBoard';
import PomodoroTimer from './pages/PomodoroTimer';
import StudyPlan from './pages/StudyPlan';
import EmergencyMode from './pages/EmergencyMode';
import About from './pages/About';
import Privacy from './pages/Privacy';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="lg:mr-64 transition-all duration-300">
          <main className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/pomodoro" element={<PomodoroTimer />} />
              <Route path="/study-plan" element={<StudyPlan />} />
              <Route path="/emergency" element={<EmergencyMode />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;