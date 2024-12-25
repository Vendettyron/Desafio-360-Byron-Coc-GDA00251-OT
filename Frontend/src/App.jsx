import { useState,lazy,Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/admin/AdminLayout';
const Register = lazy(() => import('./components/Auth/Register/Register'));
const Login = lazy(() => import('./components/Auth/Login/Login'));
import {Page} from './app/dashboard/page'; // Componente de Page

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
              <Route path="/admin/*" element={<Page/>} />
            </Route>


          </Routes>
        </Suspense>
    </>
  )
}

export default App
