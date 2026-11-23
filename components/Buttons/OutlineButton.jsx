import ReactLoading from "react-loading";

const OutlineButton = ({
  state,
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
      className={`flex w-full items-center justify-center gap-2 rounded-10 border p-4 text-base font-normal transition duration-300 xs:font-medium ${
        loading
          ? "pointer-events-none cursor-not-allowed border-primary-300"
          : disabled
            ? "pointer-events-none cursor-none border-neutrall-100 text-neutrall-100 hover:border-neutrall-100"
            : state === "danger"
              ? "border-danger-600 text-danger-600"
              : `border-primary-500 text-primary-500 hover:border-primary-600 hover:text-primary-600`
      }`}
    >
      {loading ? (
        <ReactLoading type={"spin"} color={"#1f6be0"} height={24} width={24} />
      ) : (
        <>
          {RightIcon && <div>{RightIcon}</div>}
          <span>{title}</span>
          {LeftIcon && <div>{LeftIcon}</div>}
        </>
      )}
    </button>
  );
};

export default OutlineButton;
