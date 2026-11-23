const Divider = ({ dash }) => {
  return (
    <div
      className={`h-[1px] border-t border-[#f7f7f7] ${
        dash ? "border-dashed" : "border-solid"
      }`}
    />
  );
};

export default Divider;
