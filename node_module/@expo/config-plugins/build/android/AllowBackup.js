"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
exports.withAllowBackup = android_plugins_1.createAndroidManifestPlugin(setAllowBackup, 'withAllowBackup');
function getAllowBackup(config) {
    var _a, _b;
    // Defaults to true.
    // https://docs.expo.io/versions/latest/config/app/#allowbackup
    return (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.allowBackup) !== null && _b !== void 0 ? _b : true;
}
exports.getAllowBackup = getAllowBackup;
function setAllowBackup(config, androidManifest) {
    const allowBackup = getAllowBackup(config);
    const mainApplication = Manifest_1.getMainApplication(androidManifest);
    if (mainApplication === null || mainApplication === void 0 ? void 0 : mainApplication.$) {
        mainApplication.$['android:allowBackup'] = String(allowBackup);
    }
    return androidManifest;
}
exports.setAllowBackup = setAllowBackup;
function getAllowBackupFromManifest(androidManifest) {
    const mainApplication = Manifest_1.getMainApplication(androidManifest);
    if (mainApplication === null || mainApplication === void 0 ? void 0 : mainApplication.$) {
        return String(mainApplication.$['android:allowBackup']) === 'true';
    }
    return null;
}
exports.getAllowBackupFromManifest = getAllowBackupFromManifest;
//# sourceMappingURL=AllowBackup.js.map