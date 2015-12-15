export default class ValidationFactors {
  constructor(validationFactorPairs) {
    this.validationFactors = validationFactorPairs;
  }

  toCrowd() {
    let validationFactorsArr = [];
    for (var name in this.validationFactors) {
      if (this.validationFactors.hasOwnProperty(name)) {
        let value = this.validationFactors[name];
        validationFactorsArr.push({ name, value });
      }
    }
    return { validationFactors: validationFactorsArr };
  }

  static fromCrowd(validationFactorsObj) {
    let validationFactorPairs = {};
    validationFactorsObj.validationFactors.forEach((validationFactor) => {
      validationFactorPairs[validationFactor.name] = validationFactor.value;
    });
    return new ValidationFactors(validationFactorPairs);
  }
}
