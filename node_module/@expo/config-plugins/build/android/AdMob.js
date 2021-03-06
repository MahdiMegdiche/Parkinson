"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
const META_APPLICATION_ID = 'com.google.android.gms.ads.APPLICATION_ID';
const META_DELAY_APP_MEASUREMENT_INIT = 'com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT';
exports.withAdMob = android_plugins_1.createAndroidManifestPlugin(setAdMobConfig, 'withAdMob');
function getGoogleMobileAdsAppId(config) {
    var _a, _b, _c;
    return (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.googleMobileAdsAppId) !== null && _c !== void 0 ? _c : null;
}
exports.getGoogleMobileAdsAppId = getGoogleMobileAdsAppId;
function getGoogleMobileAdsAutoInit(config) {
    var _a, _b, _c;
    return (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.googleMobileAdsAutoInit) !== null && _c !== void 0 ? _c : false;
}
exports.getGoogleMobileAdsAutoInit = getGoogleMobileAdsAutoInit;
function setAdMobConfig(config, androidManifest) {
    const appId = getGoogleMobileAdsAppId(config);
    const autoInit = getGoogleMobileAdsAutoInit(config);
    const mainApplication = Manifest_1.getMainApplicationOrThrow(androidManifest);
    if (appId) {
        Manifest_1.addMetaDataItemToMainApplication(mainApplication, META_APPLICATION_ID, appId);
        Manifest_1.addMetaDataItemToMainApplication(mainApplication, META_DELAY_APP_MEASUREMENT_INIT, String(!autoInit));
    }
    else {
        Manifest_1.removeMetaDataItemFromMainApplication(mainApplication, META_APPLICATION_ID);
        Manifest_1.removeMetaDataItemFromMainApplication(mainApplication, META_DELAY_APP_MEASUREMENT_INIT);
    }
    return androidManifest;
}
exports.setAdMobConfig = setAdMobConfig;
//# sourceMappingURL=AdMob.js.map