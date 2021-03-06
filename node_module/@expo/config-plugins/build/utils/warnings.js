"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _warningsIOS = [];
let _warningsAndroid = [];
function hasWarningsIOS() {
    return !!_warningsIOS.length;
}
exports.hasWarningsIOS = hasWarningsIOS;
function hasWarningsAndroid() {
    return !!_warningsAndroid.length;
}
exports.hasWarningsAndroid = hasWarningsAndroid;
function addWarningAndroid(tag, text, link) {
    _warningsAndroid = [..._warningsAndroid, [tag, text, link]];
}
exports.addWarningAndroid = addWarningAndroid;
function addWarningIOS(tag, text, link) {
    _warningsIOS = [..._warningsIOS, [tag, text, link]];
}
exports.addWarningIOS = addWarningIOS;
function addWarningForPlatform(platform, tag, text, link) {
    if (platform === 'ios') {
        addWarningIOS(tag, text, link);
    }
    else {
        addWarningAndroid(tag, text, link);
    }
}
exports.addWarningForPlatform = addWarningForPlatform;
function flushWarningsAndroid() {
    const result = _warningsAndroid;
    _warningsAndroid = [];
    return result;
}
exports.flushWarningsAndroid = flushWarningsAndroid;
function flushWarningsIOS() {
    const result = _warningsIOS;
    _warningsIOS = [];
    return result;
}
exports.flushWarningsIOS = flushWarningsIOS;
//# sourceMappingURL=warnings.js.map