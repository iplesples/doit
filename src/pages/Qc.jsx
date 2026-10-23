import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { getSummary, getOptions } from "@/hooks/protoApi"
import ErrorBoundary from "@/components/elements/ErrorBoundary"
import Header from "@/components/fragments/Header"
import RepairTable from "@/components/fragments/RepairTable"
import MonitorOutput from "@/components/fragments/MonitorOutput"
import QcScanner from "@/components/fragments/QcScanner"
import OptionDrawer from "@/components/fragments/OptionDrawer"

export default function Qc() {
  const { nomor } = useParams()
  const [data, setData] = useState(null)
  const [options, setOptions] = useState([])
  const [memuat, setMemuat] = useState(true)      // data awal sedang diambil
  const [mengirim, setMengirim] = useState(false) // scan sedang dikirim
  const line = Number(nomor)

  // pilihan operator, process, defect untuk select di drawer
  const muatOptions = useCallback(() => {
    if (!(line > 0)) return Promise.resolve()

    return getOptions(line)
      .then(setOptions)
      .catch((err) => console.error(err))
  }, [line])

  // data awal: angka monitor dan daftar repair
  useEffect(() => {
    if (!(line > 0)) return

    getSummary(line)
      .then(setData)
      .catch((err) => {
        console.error(err)
        setData({ message: "Gagal memuat data awal" })
      })
      .finally(() => setMemuat(false))
  }, [line])

  useEffect(() => {
    muatOptions()
  }, [muatOptions])

  if (!(line > 0)) {
    return (
      <div className="flex h-dvh items-center justify-center bg-zinc-950 text-2xl font-semibold text-red-400">
        Alamat halaman tidak valid
      </div>
    )
  }

  return (
    <div className="flex flex-col w-screen h-dvh overflow-hidden bg-zinc-950 text-white font-sans select-none">
      {/* Header Bar */}
      <div className="h-[9%] min-h-15 shrink-0 border-b border-zinc-800/80">
        <Header line={line} loading={memuat || mengirim} />
      </div>

      {/* Main Workspace Grid */}
      <div className="flex flex-row w-full h-[91%] p-3 gap-3 bg-zinc-950/90 overflow-hidden">
        {/* Kolom Kiri: Scanner di atas, Tombol Layout di bawah */}
        <div className="flex w-1/5 h-full flex-col gap-3 min-w-65">
          <div className="min-h-0 flex-1 relative flex flex-col">
            <ErrorBoundary>
              <QcScanner
                lineId={line}
                options={options}
                onLoading={setMengirim}
                onResult={setData}
                onChanged={muatOptions}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Kolom Tengah: Tabel Antrean Repair */}
        <div className="w-3/5 h-full flex flex-col min-w-0">
          <ErrorBoundary>
            <RepairTable data={data} />
          </ErrorBoundary>
        </div>

        {/* Kolom Kanan: Kartu Monitor / Output Metrik */}
        <div className="w-1/5 h-full flex flex-col min-w-50">
          <ErrorBoundary>
            <MonitorOutput data={data} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}