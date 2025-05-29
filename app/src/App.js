import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppNavbar } from './components/AppNavBar';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppNavbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<FileUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
