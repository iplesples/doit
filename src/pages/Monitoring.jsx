import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  UserCheck,
  TrendingUp,
  Loader2,
  RotateCw,
  Layers,
} from "lucide-react"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Monitoring() {
  const navigate = useNavigate()

  const [summaryData, setSummaryData] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [error, setError] = useState("")

  const [selectedLine, setSelectedLine] = useState(null)
  
  const [hourlyRepairs, setHourlyRepairs] = useState([])
  const [hourlyOutputRectified, setHourlyOutputRectified] = useState([])
  const [topOperators, setTopOperators] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetchSummary()
  }, [])

  async function fetchSummary() {
    setLoadingSummary(true)
    try {
      const { data } = await api.get("/monitoring")
      setSummaryData(data)
      if (data.lines && data.lines.length > 0 && !selectedLine) {
        setSelectedLine(data.lines[0])
      }
    } catch (err) {
      setError("Gagal memuat data monitoring dari server.")
      console.error(err)
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (selectedLine) {
      fetchLineDetails(selectedLine.line_id)
    }
  }, [selectedLine])

  async function fetchLineDetails(lineId) {
    setLoadingDetail(true)
    try {
      const [resHourly, resOutputRec, resOperators] = await Promise.all([
        api.get(`/monitoring/line/${lineId}/hourly`),
        api.get(`/monitoring/line/${lineId}/hourly-output-rectified`),
        api.get(`/monitoring/line/${lineId}/top-operators`),
      ])

      setHourlyRepairs(resHourly.data)
      setHourlyOutputRectified(resOutputRec.data)
      setTopOperators(resOperators.data)
    } catch (err) {
      console.error("Gagal memuat detail chart line:", err)
    } finally {
      setLoadingDetail(false)
    }
  }

  function getMaxVal(data, key) {
    if (!data || data.length === 0) return 1
    const max = Math.max(...data.map(item => item[key]))
    return max === 0 ? 1 : max
  }

  const maxLineRepair = summaryData?.lines ? getMaxVal(summaryData.lines, "total_repair_today") : 1

  return (
    <div className="relative min-h-dvh bg-background text-foreground flex flex-col pb-10 overflow-x-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/80 px-4 py-3.5 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="size-9 rounded-xl hover:bg-accent shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold tracking-tight flex items-center gap-1.5 leading-tight">
              <Activity className="size-4 text-primary animate-pulse shrink-0" />
              <span>QC Live Monitoring</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
              {summaryData?.date || "Memuat..."}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={fetchSummary}
          className="size-9 rounded-xl shrink-0 border-border/60 bg-card/50 backdrop-blur-md shadow-xs hover:bg-accent hover:text-accent-foreground"
          title="Refresh Data"
        >
          <RotateCw className="size-4 text-primary" />
        </Button>
      </header>

      <main className="relative z-10 flex-1 px-4 pt-5 space-y-6 max-w-md mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-destructive font-medium text-xs shadow-md">
            {error}
          </div>
        )}

        {loadingSummary ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-muted-foreground">
            <Loader2 className="animate-spin size-7 text-primary" />
            <p className="text-xs font-medium tracking-wide">Menghubungkan ke server...</p>
          </div>
        ) : (
          <>
            {/* 1. HORIZONTAL BAR CHART SUMMARY (Angka Dilingkari & Aksen Warna) */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden gap-0">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" />
                    Peringkat Repair Line Hari Ini
                  </CardTitle>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    Terbanyak
                  </span>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">
                  Ketuk baris line untuk melihat analisis grafik per jam.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-2.5">
                {summaryData?.lines?.map((line, index) => {
                  const isSelected = selectedLine?.line_id === line.line_id
                  const percent = Math.max((line.total_repair_today / maxLineRepair) * 100, 5)
                  const isTopThree = index < 3

                  return (
                    <button
                      key={line.line_id}
                      onClick={() => setSelectedLine(line)}
                      className={`w-full flex items-center rounded-xl border transition-all duration-300 overflow-hidden text-left ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 bg-primary/10 shadow-md"
                          : "border-border/50 bg-background/50 hover:bg-muted/40"
                      }`}
                    >
                      {/* Sisi Kiri: Nama Line & Badge Angka Dilingkari */}
                      <div className="w-24 shrink-0 px-3 py-2.5 bg-muted/30 border-r border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                            isTopThree 
                              ? "bg-rose-500 text-white shadow-xs" 
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}>
                            {index + 1}
                          </span>
                          <span className={`text-xs font-bold tracking-tight truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {line.line_name}
                          </span>
                        </div>
                      </div>

                      {/* Sisi Kanan: Bar Capsule (Rose untuk Top 3, Zinc untuk Lainnya) */}
                      <div className="flex-1 px-2.5 py-1.5 flex items-center">
                        <div className="w-full bg-muted/40 rounded-full h-7 border border-border/40 relative overflow-hidden flex items-center justify-between px-2.5">
                          <div
                            style={{ width: `${percent}%` }}
                            className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${
                              isTopThree
                                ? "bg-linear-to-r from-rose-500/90 to-rose-400/80"
                                : "bg-linear-to-r from-zinc-600 to-zinc-400 dark:from-zinc-500 dark:to-zinc-300"
                            }`}
                          />
                          <span className="relative z-10 text-xs font-black text-foreground ml-auto pl-1">
                            {line.total_repair_today} <span className="text-[9px] font-normal text-muted-foreground">pcs</span>
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* 2. DETAIL ANALISIS LINE TERPILIH */}
            {selectedLine && (
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Detail Grafik</span>
                    <h2 className="text-sm font-black text-foreground tracking-tight">{selectedLine.line_name}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="text-black">Total repair : {selectedLine.total_repair_today}</span>
                    <span>•</span>
                    <span className="text-amber-500">Repair aktif : {selectedLine.active_repair_count}</span>
                  </div>
                </div>

                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-muted-foreground">
                    <Loader2 className="animate-spin size-6 text-primary" />
                    <p className="text-xs font-medium">Memproses data analitik...</p>
                  </div>
                ) : (
                  <>
                    {/* CHART 2: Repair Per Jam (Warna Zinc Netral) */}
                    <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden gap-0">
                      <CardHeader className="p-4 pb-1">
                        <CardTitle className="text-xs font-bold flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-zinc-500/15 text-zinc-600 dark:text-zinc-300">
                            <TrendingUp className="size-3.5" />
                          </div>
                          <span>Jumlah Repair Per Jam (08:00 - 18:00)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="h-40 flex items-end gap-1.5 pt-4 pb-1 border-b border-border/40">
                          {hourlyRepairs.map((item, idx) => {
                            const max = getMaxVal(hourlyRepairs, "repair_count")
                            const heightPercent = (item.repair_count / max) * 100
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <span className="text-[9px] text-muted-foreground font-bold">
                                  {item.repair_count > 0 ? item.repair_count : ""}
                                </span>
                                <div 
                                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                                  className="w-full bg-linear-to-t from-zinc-600 to-zinc-400 dark:from-zinc-500 dark:to-zinc-300 rounded-t-md transition-all duration-300"
                                />
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex justify-between pt-2 text-[9px] text-muted-foreground font-semibold px-0.5">
                          {hourlyRepairs.map((item, idx) => (
                            <span key={idx} className="flex-1 text-center truncate">{item.hour.substring(0, 2)}</span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* CHART 3: Output vs Rectified Per Jam (Output = Blue, Rectified = Zinc) */}
                    <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden gap-0">
                      <CardHeader className="p-4 pb-1">
                        <CardTitle className="text-xs font-bold flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                            <CheckCircle2 className="size-3.5" />
                          </div>
                          <span>Output vs Rectified Per Jam</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="h-40 flex items-end gap-1.5 pt-4 pb-1 border-b border-border/40">
                          {hourlyOutputRectified.map((item, idx) => {
                            const max = Math.max(getMaxVal(hourlyOutputRectified, "output"), getMaxVal(hourlyOutputRectified, "rectified"))
                            const hOutput = (item.output / max) * 100
                            const hRectified = (item.rectified / max) * 100
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                                  <div style={{ height: `${Math.max(hOutput, 6)}%` }} className="w-1/2 bg-blue-500 rounded-t-xs" />
                                  <div style={{ height: `${Math.max(hRectified, 6)}%` }} className="w-1/2 bg-zinc-400 dark:bg-zinc-500 rounded-t-xs" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-5 pt-3 text-[10px] font-semibold text-muted-foreground">
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-blue-500" /> Total Output</div>
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500" /> Rectified</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CHART 4: Top 5 Operator */}
                    <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden gap-0">
                      <CardHeader className="p-4 pb-1">
                        <CardTitle className="text-xs font-bold flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                            <UserCheck className="size-3.5" />
                          </div>
                          <span>Top Operator Repair Terbanyak</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        {topOperators.length === 0 ? (
                          <div className="text-center py-6 text-xs text-muted-foreground font-medium bg-muted/20 rounded-xl border border-dashed border-border/60">
                            Belum ada data operator repair tercatat hari ini. Aman! 🎉
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {topOperators.map((op, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/50 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-[11px]">
                                    {idx + 1}
                                  </div>
                                  <span className="font-bold text-foreground">{op.operator_name}</span>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20">
                                  {op.repair_count} Repair
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}