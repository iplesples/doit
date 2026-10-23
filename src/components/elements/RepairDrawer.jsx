import { useState } from "react"
import { X, Wrench, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const kosong = { operator: "", process: "", defect: "" }

const fields = [
  { name: "operator", label: "Operator" },
  { name: "process", label: "Process / Proses" },
  { name: "defect", label: "Defect / Kerusakan" },
]

export default function RepairDrawer({ open, code, options = [], onOpenChange, onSend }) {
  const [form, setForm] = useState(kosong)

  const pilih = (name, value) => setForm({ ...form, [name]: value })

  const lengkap = fields.every((f) => form[f.name])

  const kirim = () => {
    if (!lengkap) return
    onSend(form)
    setForm(kosong)
  }

  return (
    /* Posisikan menempel persis di sebelah kanan panel scanner */
    <div
      className={`absolute left-[calc(100%+12px)] top-0 z-30 h-full w-96 max-w-[80vw] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Panel yang muncul/slide dari kiri ke kanan tepat di sebelah scanner */}
      <div
        onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
        className={`flex h-full flex-col gap-5 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-base text-white shadow-2xl transition-all duration-300 ease-out font-sans ${
          open 
            ? "opacity-100 translate-x-0 visible" 
            : "opacity-0 -translate-x-4 invisible"
        }`}
      >
        {/* Header Drawer */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-base">
              <Wrench className="size-5" />
              <h2>Form Data Repair</h2>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700 inline-block font-semibold">
              Barcode: {code || "-"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tutup"
            className="h-9 w-9 bg-zinc-800 border-zinc-600 text-zinc-100 hover:bg-zinc-700 rounded-xl shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Form Selection (Tablet Optimized - Kontras Jelas) */}
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
          {fields.map((f) => {
            const pilihan = options
              .filter((o) => o.kind === f.name)
              .map((o) => o.name)

            return (
              <div key={f.name} className="flex flex-col gap-2">
                <Label htmlFor={f.name} className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {f.label}
                </Label>

                <Select value={form[f.name]} onValueChange={(v) => pilih(f.name, v)}>
                  <SelectTrigger
                    id={f.name}
                    className="w-full h-11 border-zinc-700 bg-zinc-800 text-white text-sm font-semibold rounded-xl focus:ring-primary px-4"
                  >
                    <SelectValue placeholder={`Pilih ${f.label.split("/")[0].toLowerCase().trim()}...`} />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800 text-white rounded-xl shadow-2xl">
                    {pilihan.map((nama) => (
                      <SelectItem
                        key={nama}
                        value={nama}
                        className="focus:bg-amber-700 focus:text-white cursor-pointer py-2.5 text-sm font-medium"
                      >
                        {nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {pilihan.length === 0 && (
                  <p className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1.5 rounded-lg font-medium">
                    Belum ada opsi. Tambahkan lewat tombol Layout.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-zinc-800">
          <Button
            variant="default"
            className={`w-full h-12 text-sm font-bold tracking-wide transition-all shadow-lg ${
              lengkap 
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
            }`}
            disabled={!lengkap}
            onClick={kirim}
          >
            <CheckCircle2 className="size-4 mr-2" />
            Simpan Repair Data
          </Button>
        </div>
      </div>
    </div>
  )
}