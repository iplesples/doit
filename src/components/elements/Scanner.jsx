import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CameraOff, Camera } from "lucide-react";

export default function Scanner({ state, timer = 60 }) {
  const [aktif, setAktif] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!aktif) return;

    let scanner;
    let idle;
    let jalan = false;

    // matikan kamera kalau tidak ada scan selama `timer` detik
    const mulaiTimer = () => {
      clearTimeout(idle);
      idle = setTimeout(() => setAktif(false), timer * 1000);
    };

    // tunda sedikit agar aman dari StrictMode
    const tunda = setTimeout(() => {
      scanner = new Html5Qrcode("kamera");
      mulaiTimer();

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10 },
          (teks) => {
            state(teks);
            mulaiTimer(); // scan berhasil, hitung ulang timer
          },
          () => {}
        )
        .then(() => {
          jalan = true;
        })
        .catch((err) => {
          setError(String(err));
          setAktif(false);
        });
    }, 100);

    return () => {
      clearTimeout(tunda);
      clearTimeout(idle);
      if (scanner && jalan) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, [aktif, timer, state]);

  return (
    <div className="relative w-full flex-1 min-h-0 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-inner">
      <div
        id="kamera"
        className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
      ></div>

      {!aktif && (
        <button
          onClick={() => {
            setError("");
            setAktif(true);
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900/95 text-zinc-300 p-4 text-xs z-10 transition-colors hover:text-white"
        >
          <div className="p-3 rounded-full bg-zinc-800 text-primary border border-zinc-700">
            <Camera size={28} />
          </div>
          <span className="text-xs font-semibold tracking-wide">Kamera Nonaktif · Tap untuk Mengaktifkan</span>
          {error && <span className="text-red-400 text-[10px] text-center max-w-[80%]">{error}</span>}
        </button>
      )}
    </div>
  );
}