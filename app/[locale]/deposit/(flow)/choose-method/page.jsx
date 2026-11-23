"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addCommas } from "@persian-tools/persian-tools";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { WageCalculatorService } from "@/services/wageCalculatorService";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import roundBanking from "@/utils/roundBanking";
import { resetState } from "@/store/reducers/deposit";
import { constants } from "@/constants/constants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PaymentMethod from "@/app/[locale]/deposit/_components/PaymentMethod";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import LightButton from "@/components/Buttons/LightButton";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const depositAmount = useSelector((state) => state.deposit.amount);
  const [paymentMethod, setPaymentMethod] = useState(
    depositAmount <= constants.deposit_maximum_amount ? "ipg" : "identified",
  );
  const [wage, setWage] = useState(0);
  const [wageCalculatorInstance, setWageCalculatorInstance] = useState(null);
  const [warningBottomSheet, setWarningBottomSheet] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initWageCalculator = async () => {
      const wage_type =
        paymentMethod === "ipg"
          ? constants.transaction_types_for_wage_params.deposit_ipg
          : constants.transaction_types_for_wage_params.deposit_pip;
      const calculator = new WageCalculatorService(makeRequest, wage_type);
      await calculator.fetchWageVariables();
      setWageCalculatorInstance(calculator);
    };
    initWageCalculator().then(() => {});
  }, [paymentMethod]);

  useEffect(() => {
    if (wageCalculatorInstance) {
      const calculatedWage = roundBanking(
        wageCalculatorInstance.calculateWage(depositAmount),
        0,
      );
      setWage(calculatedWage);
    }
  }, [wageCalculatorInstance]);

  const handleSetMethod = (method) => {
    /**
     * handle changing methods depending on the entered amount
     * @param {String} method ipg|identified
     * @return {void}
     */
    if (method === "ipg") {
      if (depositAmount <= constants.deposit_maximum_amount) {
        setPaymentMethod("ipg");
      } else {
        setWarningBottomSheet(true);
      }
    } else {
      setPaymentMethod("identified");
    }
  };

  const handleConfirmMethod = async () => {
    /**
     * redirect user to ipg or to net page for deposit identification, based on the chosen payment method
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      if (paymentMethod === "ipg") {
        setLoading(true);
        await makeRequest(
          {
            method: "POST",
            url: "/financial_doc/deposits/?transaction_type=1",
            data: {
              amount: depositAmount,
              currency: 0,
            },
          },
          (responseData) => {
            window.location.assign(responseData.payment_url);
            setLoading(false);
            dispatch(resetState());
          },
          () => {
            setLoading(false);
            showToast("system");
          },
          () => {
            setLoading(false);
          },
        );
      } else {
        router.push("/deposit/choose-card");
      }
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4">
      <Header
        icon={"/icons/chevron-right.svg"}
        title={"روش های پرداخت"}
        background={true}
        rightIconAction={() => {
          router.push("/deposit/fill-amount");
        }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-start gap-8 px-4 pb-8">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <div className="text-sm font-normal text-neutrall-900">
              لطفا روش پرداخت را انتخاب کنید
            </div>
            <div
              className={`flex flex-col gap-3 ${depositAmount > constants.deposit_maximum_amount && "flex-col-reverse"}`}
            >
              <PaymentMethod
                state={
                  paymentMethod === "ipg"
                    ? "selected"
                    : depositAmount <= constants.deposit_maximum_amount
                      ? "default"
                      : "disabled"
                }
                title={"درگاه پرداخت"}
                desc={"برای مبالغ کمتر از 50 میلیون تومان"}
                onClick={() => handleSetMethod("ipg")}
              />
              <PaymentMethod
                state={
                  "disabled"
                  // paymentMethod === "identified" ? "selected" : "default"
                }
                title={"واریز شناسه‌دار"}
                desc={"بدون محدودیت مبلغ (موقتا غیرفعال)"}
                onClick={
                  () => {}
                  // handleSetMethod("identified")
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-5 border border-neutrall-200 p-4">
            <div className="flex items-center justify-between text-neutrall-500">
              <div className="text-xs">مبلغ پرداختی</div>
              <div className="flex items-center gap-1">
                <div className="text-sm">{addCommas(depositAmount)}</div>
                <div className="text-xs">{mapCurrencyToName("IRR", "fa")}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-neutrall-300">
              <div className="text-xs">کارمزد</div>
              <div className="flex items-center gap-1">
                <div className="text-sm">{addCommas(wage)}</div>
                <div className="text-xs">{mapCurrencyToName("IRR", "fa")}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-neutrall-500">
              <div className="text-xs font-bold">مبلغ واریزی به کیف پول</div>
              <div className="flex items-center gap-1">
                <div className="text-base">
                  {addCommas(depositAmount - wage)}
                </div>
                <div className="text-xs font-bold">
                  {mapCurrencyToName("IRR", "fa")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col gap-8">
          {paymentMethod === "identified" && (
            <div className="flex flex-col gap-2.5 rounded-5 bg-background p-4 text-xs text-neutrall-900">
              <div className="font-medium">
                چگونه واریز شناسه‌دار انجام دهم؟
              </div>
              <ul className="list-disc pr-4">
                <li>انتخاب شبای مبداء و ایجاد شناسه‌ی واریز.</li>
                <li>
                  واریز مبلغ دلخواه با اینترنت بانک، همراه بانک،‌ عابر بانک و یا
                  مراجعه به شعب بانکی.
                </li>
              </ul>
            </div>
          )}
          <PrimaryButton
            title={"ادامه"}
            disabled={false}
            loading={loading}
            btnAction={handleConfirmMethod}
          />
        </div>
      </div>
      <BottomSheet
        open={warningBottomSheet}
        onClose={() => setWarningBottomSheet(false)}
      >
        <div className="flex w-full flex-col gap-8 px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Image
              src={"/icons/warning-triangle.svg"}
              alt={"warning"}
              width={48}
              height={48}
            />
            <div className="text-center text-sm font-normal text-black">
              جهت واریز از طریق درگاه پرداخت لازم است مبلغ واریزی حداکثر 50
              میلیون تومان باشد.
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <PrimaryButton
              title={"ویرایش مبلغ"}
              btnAction={() => {
                router.push("/deposit/fill-amount");
              }}
              disabled={false}
            />
            <LightButton
              title={"انصراف"}
              btnAction={() => setWarningBottomSheet(false)}
              disabled={false}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
export default withAuth(Page);
