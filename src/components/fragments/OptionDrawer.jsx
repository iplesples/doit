import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X, AlertCircle, LayoutGrid } from "lucide-react"
import { postOption, patchOption, deleteOption } from "@/hooks/protoApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

const KOLOM = [
  { kind: "operator", judul: "Operator" },
  { kind: "process", judul: "Process" },
  { kind: "defect", judul: "Defect" },
]

function pesanError(err) {
  const detail = err.response?.data?.detail
  if (typeof detail === "string") return detail
  if (err.code === "ERR_NETWORK") return "Tidak dapat menghubungi server"
  return err.message
}

// Satu kolom: input tambah, daftar, tombol edit dan hapus
function Kolom({ judul, items, onTambah, onUbah, onHapus }) {
  const [nama, setNama] = useState("")
  const [editId, setEditId] = useState(null)
  const [editNama, setEditNama] = useState("")

  const tambah = async () => {
    const bersih = nama.trim()
    if (!bersih) return
    if (await onTambah(bersih)) setNama("")
  }

  const mulaiEdit = (item) => {
    setEditId(item.id)
    setEditNama(item.name)
  }

  const batalEdit = () => setEditId(null)

  const simpanEdit = async (item) => {
    const bersih = editNama.trim()
    if (!bersih || bersih === item.name) return batalEdit()
    if (await onUbah(item, bersih)) batalEdit()
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-md font-sans flex-1">
      <div className="flex items-center justify-between border-b border-zinc-700 pb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
          {judul}
        </h3>
        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-mono font-bold text-zinc-300 border border-zinc-700">
          {items.length}
        </span>
      </div>

      {/* Input Tambah Data */}
      <div className="flex gap-2">
        <Input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tambah()}
          placeholder={`Tambah ${judul.toLowerCase()}...`}
          className="h-11 border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 text-sm font-medium shadow-inner px-4"
        />
        <Button 
          variant="secondary" 
          size="icon" 
          aria-label="Tambah" 
          onClick={tambah}
          className="h-11 w-11 shrink-0 bg-primary text-primary-foreground font-bold shadow-sm"
        >
          <Plus className="size-5" />
        </Button>
      </div>

      {/* Daftar Item */}
      <ul className="flex max-h-64 flex-col gap-2.5 overflow-y-auto pr-1">
        {items.length === 0 && (
          <li className="flex items-center gap-2 py-6 text-center text-xs text-zinc-400 justify-center italic font-medium bg-zinc-800/60 rounded-lg border border-dashed border-zinc-700">
            <AlertCircle className="size-4 text-zinc-400" />
            <span>Belum ada data {judul.toLowerCase()}.</span>
          </li>
        )}

        {items.map((item) =>
          editId === item.id ? (
            <li key={item.id} className="flex items-center gap-1.5 bg-zinc-800 p-1.5 rounded-lg border-2 border-primary shadow-sm">
              <Input
                autoFocus
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && simpanEdit(item)}
                className="h-9 border-zinc-600 bg-zinc-900 text-white text-xs font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Simpan"
                className="h-9 w-9 text-emerald-400 bg-emerald-950/60 border border-emerald-800"
                onClick={() => simpanEdit(item)}
              >
                <Check className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Batal"
                className="h-9 w-9 text-zinc-300 bg-zinc-700/60 border border-zinc-600"
                onClick={batalEdit}
              >
                <X className="size-4" />
              </Button>
            </li>
          ) : (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800 border border-zinc-700 py-2.5 pl-3.5 pr-2 text-sm shadow-sm"
            >
              <span className="break-all font-semibold text-zinc-100 text-xs">
                {item.name}
              </span>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Edit ${item.name}`}
                  className="h-8 w-8 bg-zinc-900 border-zinc-600 text-zinc-200"
                  onClick={() => mulaiEdit(item)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Hapus ${item.name}`}
                  className="h-8 w-8 bg-red-950/60 border-red-800/80 text-red-300"
                  onClick={() => hapasItem(item)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          )
        )}
      </ul>
    </section>
  )
}

export default function OptionDrawer({ lineId, options = [], onChanged }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  const jalankan = async (aksi) => {
    try {
      setError("")
      await aksi()
      await onChanged()
      return true
    } catch (err) {
      setError(pesanError(err))
      return false
    }
  }

  const tambah = (kind, name) =>
    jalankan(() => postOption({ line_id: lineId, kind, name }))

  const ubah = (item, name) => jalankan(() => patchOption(item.id, { name }))

  const hapus = async (item) => {
    if (!window.confirm(`Hapus "${item.name}"?`)) return
    await jalankan(() => deleteOption(item.id))
  }

  return (
    <>
      {/* Tombol pemicu di dalam Scanner */}
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full h-11 bg-zinc-900 border-zinc-700 text-zinc-100 font-bold text-sm shadow-sm mt-auto"
        onClick={() => {
          setOpen(!open)
          setError("")
        }}
      >
        <LayoutGrid className="size-4 mr-2 text-primary" />
        Kelola Layout Line {lineId}
      </Button>

      {/* Drawer Panel yang melebar memenuhi sisa ruang layar ke kanan */}
      <div
        className={`absolute left-[calc(100%+12px)] top-0 z-30 h-full w-[calc(100vw-340px)] min-w-125 max-w-275 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className={`flex h-full flex-col gap-4 rounded-2xl border border-zinc-700 bg-zinc-950 p-5 text-base text-white shadow-2xl transition-all duration-300 ease-out font-sans ${
            open 
              ? "opacity-100 translate-x-0 visible" 
              : "opacity-0 -translate-x-4 invisible"
          }`}
        >
          {/* Header Drawer */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <LayoutGrid className="size-5" />
                <h2>LAYOUT LINE {lineId}</h2>
              </div>
              <p className="mt-1 text-xs text-zinc-300 font-medium">
                Daftar master data ini akan muncul sebagai opsi pilihan saat menginput data repair QC.
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Tutup"
              className="h-9 w-9 bg-zinc-800 border-zinc-600 text-zinc-100 hover:bg-zinc-700 rounded-xl shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-200 py-2.5">
              <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {/* Grid Kolom yang merenggang memenuhi lebar drawer */}
          <div className="grid gap-4 md:grid-cols-3 flex-1 overflow-y-auto pr-1">
            {KOLOM.map((k) => (
              <Kolom
                key={k.kind}
                judul={k.judul}
                items={options.filter((o) => o.kind === k.kind)}
                onTambah={(nama) => tambah(k.kind, nama)}
                onUbah={ubah}
                onHapus={hapus}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}