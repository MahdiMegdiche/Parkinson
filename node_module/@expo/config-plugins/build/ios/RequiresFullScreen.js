"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
exports.withRequiresFullScreen = ios_plugins_1.createInfoPlistPlugin(setRequiresFullScreen, 'withRequiresFullScreen');
// NOTES: This is defaulted to `true` for now to match the behavior prior to SDK
// 34, but will change to `false` in a future SDK version. This note was copied
// over from IosNSBundle.
function getRequiresFullScreen(config) {
    var _a;
    // Yes, the property is called ios.requireFullScreen, without the s - not "requires"
    // This is confusing indeed because the actual property name does have the s
    if ((_a = config.ios) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('requireFullScreen')) {
        return !!config.ios.requireFullScreen;
    }
    else {
        return true;
    }
}
exports.getRequiresFullScreen = getRequiresFullScreen;
// Whether requires full screen on iPad
function setRequiresFullScreen(config, infoPlist) {
    return Object.assign(Object.assign({}, infoPlist), { UIRequiresFullScreen: getRequiresFullScreen(config) });
}
exports.setRequiresFullScreen = setRequiresFullScreen;
//# sourceMappingURL=RequiresFullScreen.js.map