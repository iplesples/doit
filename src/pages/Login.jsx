import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

function getPaydayMessage() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const payday = 6

  let nextPayday = new Date(year, month, payday)

  if (today.getDate() >= payday) {
    nextPayday = new Date(year, month + 1, payday)
  }

  const todayDate = new Date(year, month, today.getDate())

  const difference = Math.round(
    (nextPayday - todayDate) / (1000 * 60 * 60 * 24)
  )

  if (difference === 0) {
    return "Hari ini gajian, guys! 🎉"
  }

  return `${difference} hari lagi gajian, guys! 💸`
}

// Mengubah error axios menjadi pesan yang bisa ditampilkan
function getErrorMessage(err) {
  const detail = err.response?.data?.detail

  if (typeof detail === "string") return detail

  if (err.code === "ERR_NETWORK") {
    return "Tidak dapat menghubungi server. Periksa koneksi dan URL API."
  }

  return err.message || "Login gagal. Silakan coba kembali."
}

export default function Login() {
  const navigate = useNavigate()

  const [nrk, setNrk] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanNrk = nrk.trim()

    if (!cleanNrk) {
      setError("NRK wajib diisi.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const { data } = await api.post("/auth/login", { nrk: cleanNrk })

      if (!data.token || !data.dashboard_path) {
        throw new Error("Respons login dari server tidak lengkap.")
      }

      const session = {
        token: data.token,
        nrk: data.nrk,
        name: data.name,
        role: data.role,
        dashboard_path: data.dashboard_path,
      }

      sessionStorage.setItem("auth", JSON.stringify(session))

      // Pengguna selalu diarahkan ke dashboard sesuai akunnya
      navigate(data.dashboard_path, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8 overflow-hidden">
      {/* Background ambient lighting subtle effects */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <section className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Identitas aplikasi */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-white/20">
            D
          </div>

          <h1 className="mt-5 text-3xl font-heading font-bold tracking-tight text-foreground">
            QC ERP
          </h1>

          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            Digitalisasi Quality Control Industri Garmen
          </p>
        </div>

        {/* Form login card */}
        <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden gap-0">
          <CardHeader className="space-y-1.5 pb-6 pt-7 text-center">
            <CardTitle className="text-xl font-bold tracking-wide">
              SEMANGAT PAGI
            </CardTitle>

            <CardDescription className="text-sm font-semibold text-primary inline-flex items-center justify-center gap-1.5 pt-1">
              <Sparkles className="size-4 text-amber-400 shrink-0" />
              <span>{getPaydayMessage()}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-4">
            <form
              id="login-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  id="nrk"
                  name="nrk"
                  type="text"
                  value={nrk}
                  onChange={(event) => setNrk(event.target.value)}
                  placeholder="Masukkan Nomor Registrasi Karyawan (NRK)"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  required
                  autoFocus
                  className="h-12 px-4 text-base bg-background/50 border-input focus-visible:ring-primary/50 transition-all"
                />
              </div>

              {error && (
                <Alert variant="destructive" role="alert" className="animate-in fade-in-50 duration-200">
                  <AlertDescription className="font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-md transition-all hover:shadow-lg hover:shadow-primary/20"
                disabled={loading || !nrk.trim()}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin size-5 mr-2" />
                    <span>Memeriksa akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="size-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 pb-6 px-6">
            <div className="flex w-full items-center gap-3 rounded-xl bg-muted/50 border border-border/50 p-3.5">
              <div className="rounded-full bg-primary/10 p-2 text-primary shrink-0">
                <ShieldCheck className="size-4" />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                Akses dashboard ditentukan secara otomatis berdasarkan hak akses akun pada sistem Doit.
              </p>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground/80 font-medium">
          QC ERP · Developed by Ilyas Sangaji
        </p>
      </section>
    </main>
  )
}