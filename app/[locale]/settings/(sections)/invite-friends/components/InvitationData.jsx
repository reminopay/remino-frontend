export default function InvitationData({ time, phoneNumber }) {
  return (
    <div className="flex w-full items-center justify-between text-sm text-[#525252]">
      <p>{time}</p>
      <p style={{ direction: "ltr" }}>{phoneNumber}</p>
    </div>
  );
}
