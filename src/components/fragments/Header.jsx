import { useState, useEffect } from "react"
import { LogOut, Activity } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

const LAMPU = [
  { color: "bg-red-500", glow: "shadow-[0_0_12px_rgba(239,68,68,0.8)]" },
  { color: "bg-amber-400", glow: "shadow-[0_0_12px_rgba(251,191,36,0.8)]" },
  { color: "bg-emerald-500", glow: "shadow-[0_0_12px_rgba(16,185,129,0.8)]" },
]

export default function Header({ line, loading }) {
  const { logout } = useAuth()
  const [sekarang, setSekarang] = useState(() => new Date())

  // jam diperbarui tiap detik
  useEffect(() => {
    const interval = setInterval(() => setSekarang(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const tanggal = sekarang.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const jam = sekarang
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replaceAll(".", ":")

  return (
    <header className="grid h-full grid-cols-3 items-center px-6 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-md text-white select-none">
      {/* Kiri: Indikator Status & Line */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-full px-3 py-1.5 shadow-inner">
          {LAMPU.map((lampu, i) => (
            <span
              key={lampu.color}
              aria-hidden="true"
              className={`size-3.5 rounded-full ${lampu.color} transition-all duration-300 ${
                loading ? "lampu-berkedip" : lampu.glow
              }`}
              style={loading ? { animationDelay: `${i * 0.4}s` } : undefined}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Activity className="size-4" />
          </div>
          <span aria-live="polite" className="text-xl font-bold tracking-wide font-sans">
            {loading ? (
              <span className="text-amber-400 animate-pulse">Loading...</span>
            ) : (
              <span>Line <span className="text-white font-mono">{line}</span></span>
            )}
          </span>
        </div>
      </div>

      {/* Tengah: Hari, Tanggal, & Jam Digital */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
          {tanggal}
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          {jam}
        </span>
      </div>

      {/* Kanan: Logout Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 text-sm font-medium border-zinc-700/80 bg-zinc-900/80 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  )
}