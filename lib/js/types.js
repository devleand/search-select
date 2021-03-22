var Types = {
  typeOf: function (val) {
      return (typeof(val)).toLowerCase();
  },

  isNull: function (val) {
      return val === null;
  },
  isUndefined: function (val) {
      return this.typeOf(val) == "undefined";
  },
  isFunction: function (val) {
      return this.typeOf(val) == "function";
  },
  isObject: function (val) {
        return this.typeOf(val) == "object";
  },
  isArray: function (val) {
      return this.typeOf(val) == "array" || val instanceof Array;
  },
  isString: function (val) {
      return this.typeOf(val) == "string";
  },
  isNumber: function (val) {
      return this.typeOf(val) == "number";
  },
  isBool: function (val) {
      return this.typeOf(val) == "boolean";
  },

  isElement: function (val) {
      return val instanceof Element;
  },

  isNodeList: function (val) {
      return val instanceof NodeList;
  },

  toNumber: function (val) {
      if (isNaN(val)) {
          throw "The passed value cannot be converted to a value of type Number!";
      } else {
          return Number(val);
      }
  },
  toBool: function (val) {
      if (isNaN(val)) {
          if (this.isString(val)) {
              return val == "true";
          } else {
              throw "The passed value cannot be converted to a value of type Boolean";
          }

      } else {
          return Boolean(Number(val));
      }
  }
};