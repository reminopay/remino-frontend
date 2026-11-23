import ReactLoading from "react-loading";

const PrimaryButton = ({
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
      className={`flex w-full items-center justify-center gap-2 rounded-10 p-4 text-sm font-normal text-primary-50 transition duration-300 xs:font-medium ${
        loading
          ? "pointer-events-none cursor-not-allowed bg-primary-300"
          : disabled
            ? "hover:bg-neutral-100 pointer-events-none cursor-none bg-neutrall-100"
            : "bg-primary-500 hover:bg-primary-600"
      }`}
    >
      {loading ? (
        <ReactLoading type={"spin"} color={"#1f6be0"} height={20} width={20} />
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

export default PrimaryButton;
