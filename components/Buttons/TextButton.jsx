import ReactLoading from "react-loading";

const TextButton = ({
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
      className={`flex w-full items-center justify-center gap-2 rounded-5 p-4 text-base font-normal transition duration-300 ${
        loading
          ? "pointer-events-none cursor-not-allowed"
          : disabled
            ? "pointer-events-none cursor-none text-neutrall-100"
            : `text-primary-500 hover:text-primary-600`
      }`}
    >
      {loading ? (
        <ReactLoading type={"spin"} color={"#1f6be0"} height={24} width={24} />
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

export default TextButton;
