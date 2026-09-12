import './App.css'
import { Link, Outlet } from 'react-router'

export default function App() {
  return (
    <>
      {/* TEMP: navegação provisória — substituída pelo layout base em #3 */}
      <nav>
        <Link to="/">Início</Link> | <Link to="/login">Login</Link> |{' '}
        <Link to="/cadastro">Cadastro</Link> | <Link to="/perfil">Perfil</Link> |{' '}
        <Link to="/catalogo">Catálogo</Link> | <Link to="/obra/1">Obra</Link> |{' '}
        <Link to="/leitura/1">Leitor</Link> | <Link to="/estante">Estante</Link> |{' '}
        <Link to="/recomendacoes">Recomendações</Link>
      </nav>
      <Outlet />
    </>
  )
}
