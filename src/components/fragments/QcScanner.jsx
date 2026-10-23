import { useState, useEffect } from "react"
import { CircleCheck, TriangleAlert, CircleX, LoaderCircle } from "lucide-react"
import { postRelease, postRepair } from "@/hooks/protoApi"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Mode from "@/components/elements/Mode"
import Scanner from "@/components/elements/Scanner"
import ManualButton from "@/components/elements/ManualButton"
import RepairDrawer from "@/components/elements/RepairDrawer"
import OptionDrawer from "@/components/fragments/OptionDrawer"

const NOTIF = {
  loading: { judul: "Mengirim...", Ikon: LoaderCircle, kelas: "border-zinc-700 bg-zinc-900/90 text-white", putar: true },
  success: { judul: "Berhasil", Ikon: CircleCheck, kelas: "border-emerald-600/50 bg-emerald-950/80 text-emerald-200" },
  warning: { judul: "Perhatian", Ikon: TriangleAlert, kelas: "border-amber-600/50 bg-amber-950/80 text-amber-200" },
  error: { judul: "Gagal", Ikon: CircleX, kelas: "border-red-600/50 bg-red-950/80 text-red-200" },
}

function pesanError(err) {
  const status = err.response?.status
  const data = err.response?.data
  let pesan

  if (typeof data?.detail === "string") {
    pesan = data.detail
  } else if (Array.isArray(data?.detail)) {
    pesan = data.detail
      .map((d) => `${d.loc?.slice(1).join(".")}: ${d.msg}`)
      .join(", ")
  } else if (typeof data === "string") {
    pesan = data
  } else if (err.code === "ERR_NETWORK") {
    pesan = "Tidak dapat menghubungi server"
  } else {
    pesan = err.message
  }

  return status ? `[${status}] ${pesan}` : pesan
}

export default function QcScanner({ lineId, options, onLoading, onResult, onChanged }) {
  const [mode, setMode] = useState(false)
  const [code, setCode] = useState("")
  const [buka, setBuka] = useState(false)
  const [notif, setNotif] = useState(null)

  const kirim = (data) => {
    onLoading?.(true)
    setNotif({ tipe: "loading", code, teks: "Menunggu jawaban server" })

    const request = mode
      ? postRepair({ line_id: lineId, code, ...data })
      : postRelease({ line_id: lineId, code })

    return request
      .then((res) => {
        onResult(res)

        if (res.message) {
          setNotif({ tipe: "warning", code, teks: res.message })
        } else {
          setNotif({ tipe: "success", code, teks: "Berhasil disimpan" })
        }
      })
      .catch((err) => {
        console.error(err)
        setNotif({ tipe: "error", code, teks: pesanError(err) })
      })
      .finally(() => {
        onLoading?.(false)
        setBuka(false)
        setCode("")
      })
  }

  useEffect(() => {
    if (!code) return
    if (mode) setBuka(true)
    else kirim()
  }, [code, mode])

  const tutup = (open) => {
    setBuka(open)
    if (!open) setCode("")
  }

  const tampil = notif && NOTIF[notif.tipe]

  return (
    <div className="relative w-full h-full bg-zinc-900/60 border border-zinc-800 shadow-xl rounded-2xl backdrop-blur-md flex flex-col justify-start items-center p-3.5 gap-3 overflow-visible z-20 font-sans">
      <Mode mode={mode} state={setMode} />
      <Scanner state={setCode} />
      <ManualButton state={setCode} />

      {/* Tombol Kelola Layout dipasang di sini */}
      <OptionDrawer lineId={lineId} options={options} onChanged={onChanged} />

      {tampil && (
        <Alert className={`mt-1 py-2 px-3 rounded-xl border ${tampil.kelas} animate-in fade-in-50 duration-200 shrink-0`}>
          <tampil.Ikon className={`size-4 ${tampil.putar ? "animate-spin" : ""}`} />
          <AlertTitle className="text-xs font-bold">{tampil.judul}</AlertTitle>
          <AlertDescription className="text-xs">
            <span className="block font-mono font-semibold break-all text-white/90">
              {notif.code}
            </span>
            <span className="opacity-90">{notif.teks}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Drawer Form Repair */}
      <RepairDrawer open={buka} code={code} options={options} onOpenChange={tutup} onSend={kirim} />
    </div>
  )
}