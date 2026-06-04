import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './pages/production/KanbanBoard';
import { ManagerDashboard } from './pages/production/ManagerDashboard';
import { WorkerTablet } from './pages/worker/WorkerTablet';
import { FinanceLedger } from './pages/finance/FinanceLedger';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-brand-dark">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-dark">
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/dashboard" element={<ManagerDashboard />} />
            <Route path="/tablet" element={<WorkerTablet />} />
            <Route path="/finance" element={<FinanceLedger />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;