import ReactLoading from "react-loading";

const DangerButton = ({
  title,
  disabled,
  btnAction,
  LeftIcon,
  RightIcon,
  loading,
}) => {
  return (
    <button
      onClick={() => btnAction()}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-10 p-4 text-base font-normal text-white transition duration-300 xs:font-medium ${
        loading
          ? "pointer-events-none cursor-not-allowed bg-danger-300"
          : disabled
            ? "pointer-events-none cursor-none bg-danger-200 hover:bg-danger-200"
            : "bg-danger-600 hover:bg-danger-700"
      }`}
    >
      {loading ? (
        <ReactLoading type={"spin"} color={"#dc1743"} height={24} width={24} />
      ) : (
        <>
          {RightIcon && <div>{RightIcon}</div>}
          {title}
          {LeftIcon && <div>{LeftIcon}</div>}
        </>
      )}
    </button>
  );
};

export default DangerButton;
