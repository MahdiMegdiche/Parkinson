"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
exports.SCREEN_ORIENTATION_ATTRIBUTE = 'android:screenOrientation';
exports.withOrientation = android_plugins_1.createAndroidManifestPlugin(setAndroidOrientation, 'withOrientation');
function getOrientation(config) {
    return typeof config.orientation === 'string' ? config.orientation : null;
}
exports.getOrientation = getOrientation;
function setAndroidOrientation(config, androidManifest) {
    const orientation = getOrientation(config);
    // TODO: Remove this if we decide to remove any orientation configuration when not specified
    if (!orientation) {
        return androidManifest;
    }
    const mainActivity = Manifest_1.getMainActivityOrThrow(androidManifest);
    mainActivity.$[exports.SCREEN_ORIENTATION_ATTRIBUTE] =
        orientation !== 'default' ? orientation : 'unspecified';
    return androidManifest;
}
exports.setAndroidOrientation = setAndroidOrientation;
//# sourceMappingURL=Orientation.js.map