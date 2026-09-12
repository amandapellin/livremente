import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 — Página não encontrada</h1>
      <p>
        A página que você procurou não existe. <Link to="/">Voltar ao início</Link>.
      </p>
    </main>
  )
}
