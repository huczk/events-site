// catch error in async functions
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
