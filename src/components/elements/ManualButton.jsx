import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyboard, Send, X } from "lucide-react";

export default function ManualButton({ state }) {
  const [buka, setBuka] = useState(false);
  const [teks, setTeks] = useState("");

  const kirim = () => {
    const code = teks.trim();
    if (!code) return;
    state(code);
    setTeks("");
    setBuka(false);
  };

  const klik = () => {
    if (!buka) setBuka(true);
    else if (teks.trim()) kirim();
    else setBuka(false);
  };

  const label = !buka ? "Input Manual" : teks.trim() ? "Kirim" : "Batal";

  return (
    <div className="w-full flex flex-col gap-2 shrink-0">
      {buka && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Input
            autoFocus
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && kirim()}
            placeholder="Masukkan kode barcode..."
            className="bg-zinc-900 text-white border-zinc-700 h-11 text-sm focus-visible:ring-primary"
          />
        </div>
      )}
      <Button 
        variant="outline" 
        className="w-full h-11 bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all font-medium" 
        onClick={klik}
      >
        {!buka ? <Keyboard className="size-4 mr-2 text-primary" /> : teks.trim() ? <Send className="size-4 mr-2 text-emerald-400" /> : <X className="size-4 mr-2 text-zinc-400" />}
        {label}
      </Button>
    </div>
  );
}