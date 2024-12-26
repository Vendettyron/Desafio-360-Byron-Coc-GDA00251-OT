import { useState,lazy,Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
const Register = lazy(() => import('./components/Auth/Register/Register'));
const Login = lazy(() => import('./components/Auth/Login/Login'));
import {AdminLayout } from './layouts/admin/AdminLayout'; // Componente de Page

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas para usuarios con rol 'Operador' */}
            <Route element={<ProtectedRoute roles={[1]} />}>
              <Route path="/admin/*" element={<AdminLayout/>} />
            </Route>


          </Routes>
        </Suspense>
    </>
  )
}

export default App
