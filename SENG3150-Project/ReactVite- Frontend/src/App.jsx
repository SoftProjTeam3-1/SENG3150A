import { Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import EntryLayout from './layout/EntryLayout';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgetPassword from './pages/ForgetPassword';
import ForgetPasswordEnterCode from './pages/ForgetPasswordEnterCode';
import ResetPassword from './pages/ResetPassword';


const router = createBrowserRouter(
  //routes using the layout are enclosed together, the dashboard is outside because it does not use the layout.
  createRoutesFromElements(
    <>
      <Route path='/' element={<EntryLayout />}>
        <Route index element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/forget-password-enter-code' element={<ForgetPasswordEnterCode />} />
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Route>)

      <Route path='/dashboard' element={<Dashboard />} />
    </>)
);

const App = () => {
    return (<RouterProvider router = {router}/>)
};

export default App