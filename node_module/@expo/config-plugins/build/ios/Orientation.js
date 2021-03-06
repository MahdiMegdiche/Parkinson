"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
exports.withOrientation = ios_plugins_1.createInfoPlistPlugin(setOrientation, 'withOrientation');
function getOrientation(config) {
    var _a;
    return (_a = config.orientation) !== null && _a !== void 0 ? _a : null;
}
exports.getOrientation = getOrientation;
exports.PORTRAIT_ORIENTATIONS = [
    'UIInterfaceOrientationPortrait',
    'UIInterfaceOrientationPortraitUpsideDown',
];
exports.LANDSCAPE_ORIENTATIONS = [
    'UIInterfaceOrientationLandscapeLeft',
    'UIInterfaceOrientationLandscapeRight',
];
function getUISupportedInterfaceOrientations(orientation) {
    if (orientation === 'portrait') {
        return exports.PORTRAIT_ORIENTATIONS;
    }
    else if (orientation === 'landscape') {
        return exports.LANDSCAPE_ORIENTATIONS;
    }
    else {
        return [...exports.PORTRAIT_ORIENTATIONS, ...exports.LANDSCAPE_ORIENTATIONS];
    }
}
function setOrientation(config, infoPlist) {
    const orientation = getOrientation(config);
    return Object.assign(Object.assign({}, infoPlist), { UISupportedInterfaceOrientations: getUISupportedInterfaceOrientations(orientation) });
}
exports.setOrientation = setOrientation;
//# sourceMappingURL=Orientation.js.map