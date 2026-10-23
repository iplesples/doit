import MonitorCard from "@/components/elements/MonitorCard";

export default function MonitorOutput({ data }) {
  return (
    <div className="flex flex-col gap-2.5 h-full font-sans">
      <MonitorCard tittle="Total Output" value={data?.output ?? 0} />
      <MonitorCard tittle="Release (Pass)" value={data?.release ?? 0} />
      <MonitorCard tittle="Rectified" value={data?.rectified ?? 0} />
      <MonitorCard tittle="Repair Units" value={data?.repair_unit ?? 0} />
      <MonitorCard tittle="Repair Points" value={data?.repair_point ?? 0} />
    </div>
  );
}