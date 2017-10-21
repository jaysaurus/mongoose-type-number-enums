module.exports = function EnumHandler (echo) {
  const _this = this;

  const enumGetCallback = (limit) => {
    return function (item) {
      const duplicateMembers = findDuplicateEnumMembers(this);
      if (!duplicateMembers.length) {
        for (let i in this) {
          if (i < (limit) && this[i] === item) {
            return parseInt(i);
          }
        }
        echo.throw('enumNotFound', item);
      } else echo.throw('enumNotUnique', `"${duplicateMembers.join('", "')}"`);
    };
  };

  const findDuplicateEnumMembers = (enumArray) => {
    return enumArray.filter((value, index, self) => self.indexOf(value) !== index);
  };

  this.mapEnumMethods = (enums, init = true) => {
    if (typeof enums === 'object') {
      var keys = Object.keys(enums);
      keys.forEach((key) => {
        if (typeof enums[key] === 'object') {
          var childKey = Object.keys(enums[key]);
          if (childKey.length && isNaN(parseInt(childKey[0]))) {
            _this.mapEnumMethods(enums[key], false);
          } else { // enum methods go here:
            const limitGuard = enums[key].length; // limit number of calls to exclude .get from enum results
            enums[key].get = enumGetCallback(limitGuard);
          }
        }
      });
      if (init) return enums;
    } else echo.throw('enumInvalid');
  };
};
