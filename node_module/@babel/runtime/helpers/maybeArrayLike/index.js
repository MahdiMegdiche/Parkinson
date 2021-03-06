var arrayLikeToArray = require("@babel/runtime/helpers/arrayLikeToArray");

function _maybeArrayLike(next, arr, i) {
  if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
    var len = arr.length;
    return arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
  }

  return next(arr, i);
}

module.exports = _maybeArrayLike;
module.exports["default"] = module.exports, module.exports.__esModule = true;