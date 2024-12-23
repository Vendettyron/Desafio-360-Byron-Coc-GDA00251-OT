import { useState,lazy,Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const Register = lazy(() => import('./components/Auth/Register/Register'));
const Login = lazy(() => import('./components/Auth/Login/Login'));


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />

            {/* Rutas protegidas para usuarios con rol 'Operador' */}
            <Route element={<ProtectedRoute roles={[1]} />}>
              <Route path="/admin" element={<h1>Panel de Administración</h1>} />
              {/* Otras rutas protegidas para Operador */}
            </Route>


          </Routes>
        </Suspense>
    </>
  )
}

export default App
