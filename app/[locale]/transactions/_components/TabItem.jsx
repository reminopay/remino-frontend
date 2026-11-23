const TabItem = ({ title, active, onClick }) => {
  return (
    <div
      className={`cursor-pointer rounded-full border border-secondary-100 px-4 py-2 text-center text-sm text-neutrall-700 ${active ? "bg-secondary-50" : "bg-white"}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
export default TabItem;
