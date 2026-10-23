import { useParams } from "react-router-dom"

export default function Monitor() {
  const { nomor } = useParams()

  return (
    <main>
      <h1>Dashboard QC</h1>
      <p>Line: {nomor}</p>
    </main>
  )
}