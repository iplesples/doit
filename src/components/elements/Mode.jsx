import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Mode({ mode, state }) {
  return (
    <div className="w-full flex items-center justify-between px-1 py-1">
      <Label 
        htmlFor="mode" 
        className={`text-2xl font-bold tracking-wider transition-all duration-300 ${
          mode 
            ? "text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" 
            : "text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        }`}
      >
        {mode ? "REPAIR" : "RELEASE"}
      </Label>
      <Switch 
        id="mode"
        checked={mode}
        onCheckedChange={state}
        className="h-10 w-16 rounded-full transition-all duration-300 border border-zinc-700 data-[state=checked]:bg-red-600 data-[state=checked]:shadow-[0_0_16px_rgba(239,68,68,0.7)] data-[state=unchecked]:bg-zinc-800 [&>span]:h-8 [&>span]:w-8 [&>span]:rounded-full [&>span]:transition-transform data-[state=checked]:[&>span]:translate-x-6 data-[state=unchecked]:[&>span]:translate-x-0.5" 
      />
    </div>
  )
}