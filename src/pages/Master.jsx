import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, LogOut } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import {
  getAccounts,
  postAccount,
  patchAccount,
  deleteAccount,
} from "@/hooks/accountApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const kosong = { nrk: "", name: "", path: "", line_id: "" }

function pesanError(err) {
  const detail = err.response?.data?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ")
  if (err.code === "ERR_NETWORK") return "Tidak dapat menghubungi server"
  return err.message
}

// Sama dengan role_from_path di backend
function peran(path) {
  if (path.startsWith("/dashboard/master")) return "master"
  if (path.startsWith("/dashboard/qc")) return "qc"
  return "guest"
}

export default function Master() {
  const { logout } = useAuth()

  const [accounts, setAccounts] = useState([])
  const [memuat, setMemuat] = useState(true)
  const [error, setError] = useState("")

  const [buka, setBuka] = useState(false)
  const [editing, setEditing] = useState(null) // akun yang sedang diedit (null = tambah baru)
  const [form, setForm] = useState(kosong)
  const [formError, setFormError] = useState("")
  const [menyimpan, setMenyimpan] = useState(false)

  const muat = useCallback(async () => {
    try {
      setAccounts(await getAccounts())
    } catch (err) {
      setError(pesanError(err))
    } finally {
      setMemuat(false)
    }
  }, [])

  useEffect(() => {
    muat()
  }, [muat])

  const ubah = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const bukaTambah = () => {
    setEditing(null)
    setForm(kosong)
    setFormError("")
    setBuka(true)
  }

  const bukaEdit = (akun) => {
    setEditing(akun)
    setForm({
      nrk: akun.nrk,
      name: akun.name,
      path: akun.path,
      line_id: akun.line_id ?? "",
    })
    setFormError("")
    setBuka(true)
  }

  const simpan = async (e) => {
    e.preventDefault()

    const nrk = form.nrk.trim()
    const name = form.name.trim()
    const path = form.path.trim()
    const line_id = form.line_id === "" ? null : Number(form.line_id)

    if (!nrk || !name || !path) {
      setFormError("NRK, nama, dan path wajib diisi.")
      return
    }

    try {
      setMenyimpan(true)
      setFormError("")

      if (editing) {
        // NRK tidak bisa diubah, jadi tidak ikut dikirim
        await patchAccount(editing.id, { name, path, line_id })
      } else {
        await postAccount({ nrk, name, path, line_id })
      }

      setBuka(false)
      setError("")
      await muat()
    } catch (err) {
      setFormError(pesanError(err))
    } finally {
      setMenyimpan(false)
    }
  }

  const hapus = async (akun) => {
    if (!window.confirm(`Hapus akun ${akun.name} (${akun.nrk})?`)) return

    try {
      setError("")
      await deleteAccount(akun.id)
      await muat()
    } catch (err) {
      setError(pesanError(err))
    }
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Master: Akun Dashboard</h1>

        <div className="flex gap-2">
          <Button onClick={bukaTambah}>
            <Plus />
            Tambah akun
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut />
            Logout
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NRK</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Peran</TableHead>
            <TableHead>Line ID</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {memuat ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Belum ada akun.
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((akun) => (
              <TableRow key={akun.id}>
                <TableCell className="font-mono">{akun.nrk}</TableCell>
                <TableCell>{akun.name}</TableCell>
                <TableCell className="font-mono text-xs">{akun.path}</TableCell>
                <TableCell>{peran(akun.path)}</TableCell>
                <TableCell>{akun.line_id ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${akun.name}`}
                    onClick={() => bukaEdit(akun)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus ${akun.name}`}
                    onClick={() => hapus(akun)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={buka} onOpenChange={setBuka}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit akun" : "Tambah akun"}</DialogTitle>
            <DialogDescription>
              Akun menentukan halaman yang dibuka setelah login.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={simpan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nrk">NRK</Label>
              <Input
                id="nrk"
                value={form.nrk}
                onChange={ubah("nrk")}
                disabled={!!editing}
                autoFocus={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" value={form.name} onChange={ubah("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="path">Path dashboard</Label>
              <Input
                id="path"
                value={form.path}
                onChange={ubah("path")}
                placeholder="/dashboard/qc/endline/1"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Master: /dashboard/master. QC: /dashboard/qc/endline/ diikuti nomor line.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="line_id">Line ID (opsional)</Label>
              <Input
                id="line_id"
                type="number"
                min="1"
                value={form.line_id}
                onChange={ubah("line_id")}
              />
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBuka(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={menyimpan}>
                {menyimpan ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}