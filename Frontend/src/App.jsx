import { useState,lazy,Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/hooks/ProtectedRoute';

import {AdminLayout } from '@/layouts/admin/AdminLayout'; // Layout de Admin
import ClienteLayout from '@/layouts/client/ClienteLayout'; // Layout de Cliente
import Roles from '@/config/roles';
import { LoginForm } from './components/ui/login-form';

const Register = lazy(() => import('./components/Auth/Register/Register'));
const Login = lazy(() => import('./components/Auth/Login/Login'));
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
              {/* Rutas de Login Y Register */}
            <Route path="/" element={<Login />}>
              <Route index element={<LoginForm />} /> {/* Ruta para "/login" */}
              <Route path="register" element={<Register />} /> {/* Ruta para "/register" */}
            </Route>

            {/* Rutas protegidas para usuarios con rol "Operador" */}
            <Route element={<ProtectedRoute roles={[Roles.ADMIN]} />}>
              <Route path="/admin/*" element={<AdminLayout/>} />
            </Route>

            {/* Rutas protegidas para usuarios con rol "Cliente" */}
            <Route element={<ProtectedRoute roles={[Roles.CLIENTE]} />}>
              <Route path="/cliente/*" element={<ClienteLayout/>} />
            </Route>

          </Routes>
        </Suspense>
    </>
  )
}

export default App
