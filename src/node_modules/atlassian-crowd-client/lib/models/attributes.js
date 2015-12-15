"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attributes = (function () {
  function Attributes(attributePairs) {
    _classCallCheck(this, Attributes);

    this.attributes = attributePairs;
  }

  _createClass(Attributes, [{
    key: "toCrowd",
    value: function toCrowd() {
      // Crowd stores attribute values in an array, which is quite limited. We use only one
      // value per attribute, this value may be of any type since we store it as JSON.
      var attributesArr = [];
      for (var key in this.attributes) {
        if (this.attributes.hasOwnProperty(key)) {
          var jsonString = JSON.stringify(this.attributes[key]);
          if (jsonString.length > 255) {
            throw new Error("Attribute " + key + " is too large. Values can be no larger than 255 characters after JSON encoding.");
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
  }], [{
    key: "fromCrowd",
    value: function fromCrowd(attributesArr) {
      var attributePairs = {};
      attributesArr.forEach(function (attribute) {
        attributePairs[attribute.name] = JSON.parse(attribute.values[0]);
      });
      return new Attributes(attributePairs);
    }
  }]);

  return Attributes;
})();

exports["default"] = Attributes;
module.exports = exports["default"];