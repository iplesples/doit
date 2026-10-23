import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MonitorCard({ tittle, value }) {
  return (
    <Card className="flex flex-col flex-1 min-h-0 gap-0 py-2 text-white bg-zinc-900/80 border-zinc-800 shadow-lg backdrop-blur-md rounded-xl transition-all hover:border-zinc-700 font-sans">
      <CardHeader className="px-3.5 pb-1 pt-2">
        <CardTitle className="text-xs font-semibold tracking-wider text-zinc-400 uppercase text-left">
          {tittle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-start px-3.5 pt-0">
        <p className="text-3xl font-extrabold tabular-nums tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}