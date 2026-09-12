import { useParams } from 'react-router'

export default function LeitorPage() {
  const { id } = useParams()
  return (
    <main>
      <h1>Leitor</h1>
      <p>Placeholder — id: {id} (implementação em #16/#17, RF15/RF16).</p>
    </main>
  )
}
