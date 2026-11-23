import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setField } from "@/store/reducers/exchange_transfer";
import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";

import Header from "@/components/common/Header";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import RadioInput from "@/components/Inputs/RadioInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const ChooseTransferMethod = ({
  open,
  onClose,
  description,
  buttonLoading,
  verifyTransferMethod,
}) => {
  const dispatch = useDispatch();
  const defaultMethod = TRANSFER_METHODS.ACCOUNT;
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod);

  useEffect(() => {
    setSelectedMethod(
      Number(
        JSON.parse(sessionStorage.getItem("exchange_transfer"))
          ?.transfer_method,
      ) || defaultMethod,
    );
  }, []);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex w-full flex-col items-center justify-start gap-6 px-4 pb-8">
        <Header title="روش انتقال" background={true} />
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <RadioInput
            state={
              selectedMethod === TRANSFER_METHODS.ACCOUNT
                ? "selected"
                : "default"
            }
            title="انتقال به حساب بانکی"
            onClick={() => setSelectedMethod(TRANSFER_METHODS.ACCOUNT)}
          />
          <RadioInput
            state={
              selectedMethod === TRANSFER_METHODS.CASH_PICKUP
                ? "selected"
                : "default"
            }
            title="تحویل حضوری در صرافی"
            desc={description}
            onClick={() => setSelectedMethod(TRANSFER_METHODS.CASH_PICKUP)}
          />
        </div>
        <PrimaryButton
          title="تایید"
          disabled={false}
          loading={buttonLoading}
          btnAction={() => {
            dispatch(
              setField({ key: "transfer_method", value: selectedMethod }),
            );
            onClose();
            verifyTransferMethod();
          }}
        />
      </div>
    </BottomSheet>
  );
};
export default ChooseTransferMethod;
