function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
  if (receiver !== classConstructor) {
    throw new TypeError("Private static access of wrong provenance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

module.exports = _classStaticPrivateFieldSpecGet;
module.exports["default"] = module.exports, module.exports.__esModule = true;