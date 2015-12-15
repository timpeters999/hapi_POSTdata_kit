export default class Attributes {
  constructor(attributePairs) {
    this.attributes = attributePairs;
  }

  toCrowd() {
    // Crowd stores attribute values in an array, which is quite limited. We use only one
    // value per attribute, this value may be of any type since we store it as JSON.
    let attributesArr = [];
    for (var key in this.attributes) {
      if (this.attributes.hasOwnProperty(key)) {
        let jsonString = JSON.stringify(this.attributes[key]);
        if (jsonString.length > 255) {
          throw new Error(`Attribute ${key} is too large. Values can be no larger than 255 characters after JSON encoding.`);
        } else {
          attributesArr.push({
            name: key,
            values: [jsonString]
          });
        }
      }
    }
    return attributesArr;
  }

  static fromCrowd(attributesArr) {
    let attributePairs = {};
    attributesArr.forEach((attribute) => {
      attributePairs[attribute.name] = JSON.parse(attribute.values[0]);
    });
    return new Attributes(attributePairs);
  }
}
