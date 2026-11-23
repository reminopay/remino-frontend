import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";
import { setField } from "@/store/reducers/exchange_transfer";

export const getTransferPayload = (exchange_transfer_data) => {
  const {
    exchange_id,
    destination,
    transfer_method,
    transactionDesc,
    afghanistan_recipient_info,
    turkey_recipient_info,
    canada_recipient_info,
    iraq_recipient_info,
  } = exchange_transfer_data;

  const currencyPayloads = {
    AFN: () => ({
      exchange_id,
      first_name: afghanistan_recipient_info.first_name,
      father_name: afghanistan_recipient_info.father_name,
      province: afghanistan_recipient_info.province.name,
      district: afghanistan_recipient_info.district.name,
      description: transactionDesc.key,
    }),

    TRY: () => {
      if (transfer_method === TRANSFER_METHODS.ACCOUNT) {
        return {
          exchange_id,
          receiver_name: turkey_recipient_info.name,
          iban: turkey_recipient_info.identifier.value,
          method: transfer_method,
          description: transactionDesc.key,
        };
      } else if (transfer_method === TRANSFER_METHODS.CASH_PICKUP) {
        return {
          exchange_id,
          receiver_name: turkey_recipient_info.name,
          passport_number: turkey_recipient_info.identifier.value,
          method: transfer_method,
          description: transactionDesc.key,
        };
      }
    },

    CAD: () => {
      if (transfer_method === TRANSFER_METHODS.ACCOUNT) {
        return {
          exchange_id,
          firstname: canada_recipient_info.first_name,
          lastname: canada_recipient_info.last_name,
          email: canada_recipient_info.identifier.value,
          method: transfer_method,
          description: transactionDesc.key,
        };
      } else if (transfer_method === TRANSFER_METHODS.CASH_PICKUP) {
        const { key, value } = canada_recipient_info.identifier;
        return {
          exchange_id,
          firstname: canada_recipient_info.first_name,
          lastname: canada_recipient_info.last_name,
          method: transfer_method,
          ...(key === "passport"
            ? { passport_number: value }
            : { id_number: value }),
          description: transactionDesc.key,
        };
      }
    },

    IQD: () => ({
      exchange_id,
      firstname: iraq_recipient_info.first_name,
      lastname: iraq_recipient_info.last_name,
      passport_number: iraq_recipient_info.passport_number,
      province: iraq_recipient_info.city,
      description: transactionDesc.key,
    }),
  };

  return currencyPayloads[destination.symbol]
    ? currencyPayloads[destination.symbol]()
    : {};
};

export const persistRecipientInfo = (
  exchange_transfer_data,
  response,
  dispatch,
) => {
  const updateField = (key, value) => {
    dispatch(setField({ key, value }));
  };

  const { destination, transfer_method, canada_recipient_info } =
    exchange_transfer_data;
  const currency = destination?.symbol;

  const currencyResponds = {
    AFN: () =>
      updateField("afghanistan_recipient_info", {
        first_name: response.first_name,
        father_name: response.father_name,
        province: { name: response.province, code: "" },
        district: { name: response.district, code: "" },
      }),

    TRY: () =>
      updateField("turkey_recipient_info", {
        name: response.receiver_name,
        identifier: {
          key: response.iban ? "iban" : response.passport_number && "passport",
          value: response.iban ? response.iban : response.passport_number,
        },
      }),

    CAD: () =>
      updateField("canada_recipient_info", {
        first_name: response.firstname,
        last_name: response.lastname,
        identifier: {
          key: response.email
            ? "email"
            : response.id_number
              ? "id"
              : "passport",
          value:
            transfer_method === TRANSFER_METHODS.CASH_PICKUP
              ? canada_recipient_info?.identifier?.key === "passport"
                ? response.passport_number
                : response.id_number
              : response.email,
        },
      }),
  };

  if (currency && currencyResponds[currency]) {
    currencyResponds[currency]();
  }
};
