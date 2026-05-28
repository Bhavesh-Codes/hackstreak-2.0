import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';
import Login from './pages/Login';
import RegisterStaff from './pages/RegisterStaff';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import RegisterPatient from './pages/RegisterPatient';
import PatientDetail from './pages/PatientDetail';
import ScanHealthCard from './pages/ScanHealthCard';
import Analytics from './pages/Analytics';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register-staff', element: <RegisterStaff /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'patients', element: <Patients /> },
      { path: 'register', element: <RegisterPatient /> },
      { path: 'patient/:id', element: <PatientDetail /> },
      { path: 'scan', element: <ScanHealthCard /> },
      { path: 'analytics', element: <Analytics /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
