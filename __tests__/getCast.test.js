echo =
  require('echo-handler')
    .configure({ messageFolder: `${__dirname.replace('__tests__','')}lib/i18n` })
    .load('messages');
const getCast = require('../lib/getCast');


describe('getCast tests', () => {
  test('getCast returns supplied number after enum object is supplied', () => {
    const mockEnumType = {
      options: {
        enum: ['a','b']
      }
    };

    const caster = getCast(echo);
    expect(caster.call(mockEnumType, 1)).toBe(1);
  });

  test('getCast throws beause the supplied value is NaN', () => {
    const mockEnumType = {
      options: {
        enum: ['a','b']
      }
    };

    const caster = getCast(echo);
    try {
      caster.call(mockEnumType, 'NaN')
    } catch (e) {
      expect(e.message).toBe(echo.raw('notAnumber', 'NaN'));
    }
  });

  test('getCast throws beause the supplied number is not an index in the given array', () => {
    const mockEnumType = {
      options: {
        enum: ['a','b']
      }
    };

    const caster = getCast(echo);
    try {
      caster.call(mockEnumType, 2)
    } catch (e) {
      expect(e.message).toBe(echo.raw('notFound'));
    }
  });

  test('getCast throws beause the mongoose enum option is not an array', () => {
    let mockEnumType = {
      options: {
        enum: 'I am not an array'
      }
    };

    const caster = getCast(echo);
    try {
      caster.call(mockEnumType, 1)
    } catch (e) {
      expect(e.message).toBe(echo.raw('notArray'));
    }

    mockEnumType = {}

    try {
      caster.call(mockEnumType, 1)
    } catch (e) {
      expect(e.message).toBe(echo.raw('notArray'));
    }

    mockEnumType = undefined

    try {
      caster.call(mockEnumType, 1)
    } catch (e) {
      expect(e.message).toBe(echo.raw('notArray'));
    }
  });
});
