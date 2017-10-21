const echoHandler = require('echo-handler');
const EnumHandler = require('../lib/EnumHandler');
const echo =
  echoHandler
    .configure({ messageFolder: `${__dirname.replace('__tests__','')}/lib/i18n` })
    .load('messages');

describe('EnumHandler integration tests', () => {
  const enumsObj = {
    a: {
      b: {
        c: {
          d: ['test1','test2','test3','test4'],
        }
      },
      e: {
        f: ['test5','test6','test7','test8'],
        g: ['test10','test10','test11','test11'],
        h: ['test12','test13'],
        i: { invalid: 'format' }
      }
    }
  }

  test('that enumsObj is mapped and that d0-3 are retrievable', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    [1,2,3,4].forEach((i) => expect(enums.a.b.c.d.get(`test${i}`)).toBe(i-1))
  });

  test('that enumsObj is mapped and that f0-3 are retrievable', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    [5,6,7,8].forEach((i) => expect(enums.a.e.f.get(`test${i}`)).toBe(i-5))
  });

  test('that enumsObj is mapped and that g0-3 throws an exception because its elements are not unique', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    let message = '';
    try {
      enums.a.e.g.get('test10');
    } catch(e) { message = e.message; };
    expect(message).toBe('An enum contained more than one identical value for: "test10", "test11". Enum values MUST be unqiue.');
  });

  test('An enum contained more than one identical value for: {0}. Enum values MUST be unqiue.', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    expect(enums.a.e.h.get('test12')).toBe(0);
  });

  test('An enum cannot be found for the requested object', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    let message = '';
    try {
      enums.a.e.h.get('notThere')
    } catch (e) { message = e.message; };
    expect(message).toBe('The requested enum member: \"notThere\", was not found.');
  });

  test('A top node of the object tree is not set up as an array', () => {
    const enums = new EnumHandler(echo).mapEnumMethods(enumsObj);
    let message = '';
    try {
      enums.a.e.i.get('format');
    } catch (e) { message = e.message; };
    expect(message).toBe('enums.a.e.i.get is not a function');
  });

  test('The an empty enums object flunks', () => {
    try {
      new EnumHandler(echo).mapEnumMethods();
    } catch (e) {
      expect(e.message).toBe(echo.raw('enumInvalid'));
    }
  });
});
