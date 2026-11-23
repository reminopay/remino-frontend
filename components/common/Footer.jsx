import PrimaryButton from "../Buttons/PrimaryButton";
import OutlineButton from "@/components/Buttons/OutlineButton";

const Footer = ({
  rightBtnTitle,
  leftBtnTitle,
  rightBtnAction,
  leftBtnAction,
  rightBtnLoading,
  leftBtnLoading,
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-4 py-2">
      <div className="col-span-1 w-full">
        <OutlineButton
          title={rightBtnTitle}
          disabled={false}
          loading={rightBtnLoading}
          btnAction={rightBtnAction}
        />
      </div>
      <div className="col-span-1 w-full">
        <PrimaryButton
          title={leftBtnTitle}
          disabled={false}
          btnAction={leftBtnAction}
          loading={leftBtnLoading}
        />
      </div>
    </div>
  );
};

export default Footer;
