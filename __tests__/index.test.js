const echo =
  require('echo-handler')
    .configure({ messageFolder: `${__dirname.replace('__tests__','')}/lib/i18n` })
    .load('messages');
const MongooseTypeNumberEnums = require('../index');

function Mockgoose() {
  this.Schema = {
    Types: { }
  };
  this.SchemaType = function (a,b,c) {
    a.push(true);
  }
};

describe('index Tests', () => {
  test('the upgradeMongooseMethod successfully returns a new mongoose type', () => {
    const inst = new MongooseTypeNumberEnums();
    var schemaTypeCalled = [] // has to be an object to be passed by ref
    const mockgoose = new Mockgoose();
    inst.upgradeMongoose(mockgoose);
    expect(typeof mockgoose.Schema.Types['Enum']).toBe('function');
    mockgoose.Schema.Types['Enum'](schemaTypeCalled);
    expect(schemaTypeCalled[0]).toBe(true);
  });

  test('the upgradeMongooseMethod is supplied an invalid object', () => {
    const duffGoose = false
    try {
      new MongooseTypeNumberEnums().upgradeMongoose(duffGoose)
    } catch (e) {
      expect(e.message).toBe(
        echo.raw('error',
          echo.raw('badMongoose', duffGoose)));
    }
  });
});
