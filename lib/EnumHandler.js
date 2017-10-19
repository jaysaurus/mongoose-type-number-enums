module.exports = function EnumHandler (echo) {
  let hasFailed = false;
  const _this = this;

  const enumGetCallback = (limit) => {
    return function (item) {
      const duplicateMembers = findDuplicateEnumMembers(this);
      if (!duplicateMembers.length) {
        for (let i in this) {
          if (i < (limit) &&
            this[i] === item) {
            let index = parseInt(i);
            return (!isNaN(index)) ? index : -1;
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
    if (enums && !hasFailed) {
      var keys = Object.keys(enums);
      if (keys) {
        keys.forEach((key) => {
          if (typeof enums[key] === 'object') {
            var childKey = Object.keys(enums[key]);
            if (childKey.length && isNaN(parseInt(childKey[0]))) {
              _this.mapEnumMethods(enums[key], false);
            } else { // enum methods go here:
              if (enums[key]) {
                const limitGuard = enums[key].length; // limit number of calls to exclude .get from enum results
                enums[key].get = enumGetCallback(limitGuard);
              }
            }
          }
        });
      }
      if (init) return enums;
    }
  };
};
