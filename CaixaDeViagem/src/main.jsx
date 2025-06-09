import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CadastroViagem from './pages/CadastroViagens.jsx'
import CadastroUsuario from './pages/CadastroUsuario.jsx'
import Pesquisar from './pages/Pesquisar.jsx'
import Viagens from './pages/Viagens.jsx'

const rotas = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <Home /> },
  { path: "/cadastrov", element: <CadastroViagem /> },
  { path: "/cadastrou", element: <CadastroUsuario /> },
  { path: "/pesquisar", element: <Pesquisar /> },
  { path: "/viagens/:tripId", element: <Viagens /> }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
