Function.prototype.myBind = function (...args) {
  if (typeof this !== "function") {
    throw new TypeError("Mybind can only be called on functions");
  }

  let obj = args[0];
  let originalFunction = this;
  return function (...args2) {
    return originalFunction.apply(obj, [...args2, ...args.slice(1)]);
  };
};
