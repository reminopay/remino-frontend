import { constants } from "@/constants/constants";

export class WageCalculatorService {
  constructor(makeRequest, transactionType) {
    this.makeRequest = makeRequest;
    this.transactionType = transactionType;
    this.wageVariables = { a: 0, b: 0 };
    this.wageThreshold = 0;
  }

  async fetchWageVariables() {
    /**
     * fetch needed parameters for calculating wage based on transaction type
     * It does not take any parameters
     * @return {Object}
     */
    const response = await new Promise((resolve, reject) => {
      this.makeRequest(
        {
          method: "GET",
          url: `/payments/wage-formula-variables/${this.transactionType}/`,
        },
        (responseData) => {
          resolve(responseData);
        },
        (error) => {
          reject(error);
        },
      );
    });

    this.parseWageVariables(response);
  }

  parseWageVariables(response) {
    /**
     * parse the passed data and assign the fields to related variables
     * @param {Object} response
     * @return {void}
     */
    const transactionType = response.find(
      (item) => item.formula_type === this.transactionType,
    );
    const ignore = response.find(
      (item) =>
        item.formula_type ===
        constants.transaction_types_for_wage_params.ignore,
    );

    this.wageVariables.a = transactionType.percentage_wage;
    this.wageVariables.b = transactionType.fixed_wage;
    this.wageThreshold = ignore.fixed_wage;
  }

  calculateWage(amount) {
    /**
     * calculate the wage based on passed amount and the wage parameters
     * @param {Number} amount
     * @return {Number}
     */
    const wage = this.wageVariables.a * amount + this.wageVariables.b;
    return wage >= this.wageThreshold ? wage : 0;
  }
}
