import ReactLoading from "react-loading";

const LightButton = ({
  title,
  disabled,
  btnAction,
  LeftIcon,
  RightIcon,
  loading,
}) => {
  return (
    <button
      onClick={() => {
        btnAction();
      }}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-10 p-4 text-base font-normal text-primary-500 transition duration-300 xs:font-medium ${
        loading
          ? "pointer-events-none cursor-not-allowed bg-primary-200"
          : disabled
            ? "hover:bg-neutral-100 pointer-events-none cursor-none bg-neutrall-100"
            : "bg-primary-50 hover:bg-primary-100"
      }`}
    >
      {loading ? (
        <ReactLoading type={"spin"} color={"#1f6be0"} height={24} width={24} />
      ) : (
        <>
          {RightIcon && <div>{RightIcon}</div>}
          <span>{title}</span>
          {LeftIcon && <div>{RightIcon}</div>}
        </>
      )}
    </button>
  );
};

export default LightButton;
