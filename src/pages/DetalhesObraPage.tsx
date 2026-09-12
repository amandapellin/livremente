import { useParams } from 'react-router'

export default function DetalhesObraPage() {
  const { id } = useParams()
  return (
    <main>
      <h1>Detalhes da obra</h1>
      <p>Placeholder — id: {id} (implementação em #14, RF13).</p>
    </main>
  )
}
