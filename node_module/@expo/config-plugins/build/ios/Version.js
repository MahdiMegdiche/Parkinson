"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
exports.withVersion = ios_plugins_1.createInfoPlistPlugin(setVersion, 'withVersion');
exports.withBuildNumber = ios_plugins_1.createInfoPlistPlugin(setBuildNumber, 'withBuildNumber');
function getVersion(config) {
    return config.version || '0.0.0';
}
exports.getVersion = getVersion;
function setVersion(config, infoPlist) {
    return Object.assign(Object.assign({}, infoPlist), { CFBundleShortVersionString: getVersion(config) });
}
exports.setVersion = setVersion;
function getBuildNumber(config) {
    var _a;
    return ((_a = config.ios) === null || _a === void 0 ? void 0 : _a.buildNumber) ? config.ios.buildNumber : '1';
}
exports.getBuildNumber = getBuildNumber;
function setBuildNumber(config, infoPlist) {
    return Object.assign(Object.assign({}, infoPlist), { CFBundleVersion: getBuildNumber(config) });
}
exports.setBuildNumber = setBuildNumber;
//# sourceMappingURL=Version.js.map