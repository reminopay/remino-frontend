import Image from "next/image";

const Toast = ({
  message,
  onClose,
  toastType,
  showCross,
  leftText,
  leftTextAction,
}) => {
  return (
    <div
      className="fixed left-1/2 top-4 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`flex transform items-center justify-between border p-4 ${
          toastType === "success"
            ? "border-success-400 bg-success-50 text-success-700"
            : toastType === "info"
              ? "border-info-400 bg-info-50 text-info-700"
              : toastType === "warning"
                ? "border-warning-400 bg-warning-50 text-warning-700"
                : toastType === "info-redo"
                  ? "border-info-400 bg-info-50 text-info-700"
                  : "border-danger-400 bg-danger-50 text-danger-700"
        } rounded-5 p-3`}
        style={{ pointerEvents: "auto" }}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-2">
          <Image
            src={
              toastType === "success"
                ? "/icons/success.svg"
                : toastType === "info"
                  ? "/icons/info.svg"
                  : toastType === "warning"
                    ? "/icons/warning.svg"
                    : toastType === "error"
                      ? "/icons/error.svg"
                      : toastType === "system-error"
                        ? "/icons/system-error.svg"
                        : "/icons/info-success.svg"
            }
            alt="icon"
            width={16}
            height={16}
          />
          <div className="text-xs font-normal">{message}</div>
        </div>
        <div className="flex gap-4">
          {leftText && (
            <button
              className="cursor-pointer text-xs font-normal"
              onClick={leftTextAction}
            >
              {leftText}
            </button>
          )}
          {showCross && (
            <Image
              src="/icons/cross.svg"
              alt="close"
              width={16}
              height={16}
              className="cursor-pointer"
              onClick={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
