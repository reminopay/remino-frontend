import { CardTick1, ConvertCard, TickCircle } from "iconsax-react";

export default function Progress({ status }) {
  const stepMap = {
    confirmed: 1,
    pending: 2,
    success: 3,
  };
  const step = stepMap[status] || 0;

  const color = (threshold) => (step >= threshold ? "#00966D" : "#ABABAB");
  const variant = (threshold) => (step >= threshold ? "Bold" : "Outline");

  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      {/* First icon turns green at stage ≥1 (confirmed+) */}
      <TickCircle color={color(1)} size={20} variant={variant(1)} />

      {/* First line turns green at stage ≥2 (pending+) */}
      <div
        className={`h-[1px] flex-1 ${
          step >= 2 ? "bg-[#00966D]" : "bg-[#ABABAB]"
        }`}
      />

      {/* Second icon turns green at stage ≥2 (pending+) */}
      <ConvertCard color={color(2)} size={20} variant={variant(2)} />

      {/* Second line turns green at stage ≥3 (success) */}
      <div
        className={`h-[1px] flex-1 ${
          step >= 3 ? "bg-[#00966D]" : "bg-[#ABABAB]"
        }`}
      />

      {/* Third icon turns green at stage ≥3 (success) */}
      <CardTick1 color={color(3)} size={20} variant={variant(3)} />
    </div>
  );
}
