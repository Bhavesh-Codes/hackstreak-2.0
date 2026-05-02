import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterPatient from './pages/RegisterPatient';
import PatientDetail from './pages/PatientDetail';
import Analytics from './pages/Analytics';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register-staff" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute><RegisterPatient /></ProtectedRoute>} />
            <Route path="/patient/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
