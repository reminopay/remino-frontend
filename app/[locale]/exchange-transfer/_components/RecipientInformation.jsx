import { chunkString } from "@/utils/chunckString";
import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";

const RecipientInformation = ({ exchange_transfer_data }) => {
  const {
    destination,
    transfer_method,
    canada_recipient_info,
    afghanistan_recipient_info,
    turkey_recipient_info,
    iraq_recipient_info,
  } = exchange_transfer_data;
  const currency = destination?.symbol;

  return currency === "AFN" ? (
    <div className="flex w-full items-center justify-between text-sm text-neutrall-500">
      <div>
        {afghanistan_recipient_info.first_name} ولد{" "}
        {afghanistan_recipient_info.father_name}
      </div>
    </div>
  ) : currency === "TRY" ? (
    <div className="flex w-full flex-col items-start justify-start gap-2 text-sm text-neutrall-500">
      <div className="flex w-full items-center justify-between">
        <div>نام و نام خانوادگی:</div>
        <div>{turkey_recipient_info.name}</div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div>
          {transfer_method === TRANSFER_METHODS.ACCOUNT
            ? "شماره شبا:"
            : "شماره پاسپورت:"}
        </div>
        <div style={{ direction: "ltr" }}>
          {turkey_recipient_info.identifier.key === "passport"
            ? turkey_recipient_info.identifier.value
            : chunkString(turkey_recipient_info.identifier.value)}
        </div>
      </div>
    </div>
  ) : currency === "IQD" ? (
    <div className="flex w-full flex-col items-start justify-start gap-2 text-sm text-neutrall-500">
      <div className="flex w-full items-center justify-between">
        <div>نام و نام خانوادگی:</div>
        <div>
          {iraq_recipient_info.first_name} {iraq_recipient_info.last_name}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div>شماره گذرنامه:</div>
        <div style={{ direction: "ltr" }}>
          {iraq_recipient_info.passport_number}
        </div>
      </div>
    </div>
  ) : currency === "CAD" && transfer_method === TRANSFER_METHODS.ACCOUNT ? (
    <div className="flex w-full flex-col items-start justify-start gap-2 text-sm text-neutrall-500">
      <div className="flex w-full items-center justify-between">
        <div>نام و نام خانوادگی:</div>
        <div>
          {canada_recipient_info.first_name} {canada_recipient_info.last_name}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div>ایمیل متصل به حساب E-transfer:</div>
        <div>{canada_recipient_info.identifier.value}</div>
      </div>
    </div>
  ) : (
    currency === "CAD" &&
    transfer_method === TRANSFER_METHODS.CASH_PICKUP &&
    (canada_recipient_info.identifier.key === "passport" ? (
      <div className="flex w-full flex-col items-start justify-start gap-2 text-sm text-neutrall-500">
        <div className="flex w-full items-center justify-between">
          <div>نام و نام خانوادگی:</div>
          <div>
            {canada_recipient_info.first_name} {canada_recipient_info.last_name}
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>شماره پاسپورت:</div>
          <div>{canada_recipient_info.identifier.value}</div>
        </div>
      </div>
    ) : (
      <div className="flex w-full flex-col items-start justify-start gap-2 text-sm text-neutrall-500">
        <div className="flex w-full items-center justify-between">
          <div>نام و نام خانوادگی:</div>
          <div>
            {canada_recipient_info.first_name} {canada_recipient_info.last_name}
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>ID Number:</div>
          <div>{canada_recipient_info.identifier.value}</div>
        </div>
      </div>
    ))
  );
};
export default RecipientInformation;
