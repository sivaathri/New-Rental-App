import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Client reload trigger
import Login from './pages/Login';
import RegistrationFlow from './pages/RegistrationFlow';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegistrationFlow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
