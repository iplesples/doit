import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock } from "lucide-react"

function formatDuration(createdAt, now) {
  const start = new Date(createdAt).getTime()

  if (Number.isNaN(start)) return "-"

  const totalMinutes = Math.max(0, Math.floor((now - start) / 60000))

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")}`
}

export default function RepairTable({ data }) {
  const rows = data?.repairs ?? []
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    // tampilan hanya sampai menit, jadi cukup diperbarui tiap 10 detik
    const interval = setInterval(() => setNow(Date.now()), 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-zinc-900/60 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md">
      <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between shrink-0 bg-zinc-900/80">
        <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-300">
          Antrean Repair Aktif
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs font-semibold">
          {rows.length} Unit
        </span>
      </div>

      <div className="w-full flex-1 overflow-x-auto overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
            <TableRow className="border-b border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-bold tracking-wider text-xs uppercase pl-6">Code</TableHead>
              <TableHead className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Operator</TableHead>
              <TableHead className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Proses</TableHead>
              <TableHead className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Defect</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold tracking-wider text-xs uppercase pr-6">Timer</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="border-0">
                <TableCell
                  colSpan={5}
                  className="h-48 text-center text-zinc-500 italic text-sm"
                >
                  Belum ada data antrean repair.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => (
                <TableRow 
                  key={item.code} 
                  className="border-b border-zinc-800/60 transition-colors hover:bg-zinc-800/40 group"
                >
                  <TableCell className="font-mono font-bold text-red-400 group-hover:text-red-300 pl-6 py-3.5">
                    {item.code}
                  </TableCell>

                  <TableCell className="text-zinc-200 font-medium py-3.5">{item.operator_name}</TableCell>

                  <TableCell className="text-zinc-300 py-3.5">{item.process_name}</TableCell>

                  <TableCell className="text-zinc-300 py-3.5">{item.defect_name}</TableCell>

                  <TableCell className="text-right font-mono tabular-nums whitespace-nowrap text-amber-400 font-bold pr-6 py-3.5 flex items-center justify-end gap-1.5">
                    <Clock className="size-3.5 opacity-70" />
                    <span>{formatDuration(item.created_at, now)}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}