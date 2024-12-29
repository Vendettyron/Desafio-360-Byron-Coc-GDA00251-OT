import { useState,lazy,Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './hooks/ProtectedRoute';

import {AdminLayout } from './layouts/admin/AdminLayout'; // Layout de Admin
import Roles from '@/config/roles';

const Register = lazy(() => import('./components/Auth/Register/Register'));
const Login = lazy(() => import('./components/Auth/Login/Login'));
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            {/* Rutas protegidas para usuarios con rol 'Operador' */}
            <Route element={<ProtectedRoute roles={[Roles.ADMIN]} />}>
              <Route path="/admin/*" element={<AdminLayout/>} />
            </Route>

          </Routes>
        </Suspense>
    </>
  )
}

export default App
