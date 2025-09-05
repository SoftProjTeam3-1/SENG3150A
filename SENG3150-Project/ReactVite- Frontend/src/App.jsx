import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import EntryLayout from './layout/EntryLayout';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageActivitiesPage from './pages/ManageActivitiesPage';
import ForgetPassword from './pages/ForgetPassword';
import ForgetPasswordEnterCode from './pages/ForgetPasswordEnterCode';
import ResetPassword from './pages/ResetPassword';
import Attendance from "./pages/Attendance";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/Auth/AuthProvider.jsx';
import RequireAuth from './components/Auth/RequireAuth.jsx';

function AuthShell() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthShell />}>
      <Route path='/' element={<EntryLayout />}>
        <Route index element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/forget-password-enter-code' element={<ForgetPasswordEnterCode />} />
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Route>

    <Route
      path="/dashboard"
      element={
        <RequireAuth>
        <Dashboard />
      </RequireAuth>
     
      }
    />


      <Route path='/manage-activities' element={<ManageActivitiesPage />} />
      <Route path='/attendance' element={<Attendance />}/>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
