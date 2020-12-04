Types = {
  typeOf: function (val) {
      return (typeof(val)).toLowerCase();
  },

  isUndefined: function (val) {
      return this.typeOf(val) == "undefined" ? true : false;
  },
  isFunction: function (val) {
      return this.typeOf(val) == "function" ? true : false;
  },
  isObject: function (val) {
        return this.typeOf(val) == "object" ? true : false;
  },
  isArray: function (val) {
      return this.typeOf(val) == "array" ? true : false;
  },
  isString: function (val) {
      return this.typeOf(val) == "string" ? true : false;
  },
  isNumber: function (val) {
      return this.typeOf(val) == "number" ? true : false;
  },
  isBool: function (val) {
      return this.typeOf(val) == "boolean" ? true : false;
  },

  toNumber: function (val) {
      if (isNaN(val)) {
          throw "The passed value cannot be converted to a value of type Number!";
      } else {
          return Number(val);
      }
  },
  toBool: function (val) {
      let errtext = "The passed value cannot be converted to a value of type Boolean!";
      if (isNaN(val)) {
          if (this.isString(val)) {
              if (val == "false") {
                  return false;
              } else {
                  return true;
              }
          } else {
              throw errtext;
          }

      } else {
          return Boolean(Number(val));
      }
  }
};