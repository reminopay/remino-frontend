export default function DataRow({ title, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <p className="font-medium text-[#ABABAB]">{title}</p>
      <div className="text-sm text-[#46434D]">{value}</div>
    </div>
  );
}
