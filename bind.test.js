describe("Function.prototype.bind polyfill", () => {
  beforeAll(() => {
    // Ensure the polyfill is applied
    require("./bind");
  });

  test("this binding", () => {
    let obj = {
      val: 3,
    };

    let logger = function () {
      return this.val + 2;
    };

    expect(logger.myBind(obj)()).toBe(5);
  });

  test("arguments being passed correctly function", () => {
    let logger = function (...args) {
      return args;
    };

    let obj = {
      val: 3,
    };
    let bindLogger = logger.myBind(obj);
    expect(bindLogger("1", "3", "4")).toEqual(["1", "3", "4"]);
  });

  test("arguments being passed correctly into bind", () => {
    let logger = function (...args) {
      return args;
    };

    let obj = {
      val: 2,
    };
    let bindLogger = logger.bind(obj, "1,2,3,4");
    expect(bindLogger("4,5,6")).toEqual(["1,2,3,4", "4,5,6"]);
  });
});

test("edge case: null this", () => {
  let logger = function (...args) {
    return args;
  };
  let bindLogger = logger.bind(null, "1,2,3,4");
  expect(bindLogger("4,5,6")).toEqual(["1,2,3,4", "4,5,6"]);
});

test("return a function by myBind", () => {
  let func = () => {};

  let ghostFunc = func.myBind(null);

  expect(typeof ghostFunc).toBe("function");
});

test("return error if the this does not refer to func", () => {
  expect(() => {
    const notAFunction = {};
    Function.prototype.myBind.call(notAFunction);
  }).toThrow(TypeError);
});
