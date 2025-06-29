import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 shadow">
          <nav className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Cab Forecasting System</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/register" className="hover:underline">Register</Link>
              <Link to="/admin" className="hover:underline">Admin</Link>
            </div>
          </nav>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Cab Forecasting & Allocation System</h2>
      <p className="text-gray-700">Use the navigation above to register or access the admin dashboard.</p>
    </div>
  );
}
