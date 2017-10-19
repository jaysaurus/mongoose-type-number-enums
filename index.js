const echoHandler = require('echo-handler');
const EnumHandler = require('./lib/EnumHandler');
const getCast = require('./lib/getCast');

module.exports = function MongooseTypeNumberEnums (i18n = 'en') {
  const echo =
    echoHandler
      .configure({ i18n, messageFolder: `${__dirname}/lib/i18n` })
      .load('messages', i18n);

  function getNewType (mongoose) {
    return function newType (key, options) {
      mongoose.SchemaType.call(this, key, options, 'Enum');
    };
  }

  this.upgradeMongoose = mongoose => {
    try {
      if (typeof mongoose === 'object') {
        let newType = getNewType(mongoose);
        newType.prototype = Object.create(mongoose.SchemaType.prototype);
        newType.prototype.cast = getCast(echo);
        mongoose.Schema.Types['Enum'] = newType;
        return mongoose;
      } else echo.throw('badMongoose', mongoose);
    } catch (e) {
      echo.throw('error', e.message);
    }
  };

  this.mapEnumMethods = enumsObject => {
    return new EnumHandler(echo).mapEnumMethods(enumsObject);
  };
};
