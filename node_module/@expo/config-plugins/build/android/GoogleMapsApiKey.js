"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
const META_API_KEY = 'com.google.android.geo.API_KEY';
const LIB_HTTP = 'org.apache.http.legacy';
exports.withGoogleMapsApiKey = android_plugins_1.createAndroidManifestPlugin(setGoogleMapsApiKey, 'withGoogleMapsApiKey');
function getGoogleMapsApiKey(config) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.googleMaps) === null || _c === void 0 ? void 0 : _c.apiKey) !== null && _d !== void 0 ? _d : null;
}
exports.getGoogleMapsApiKey = getGoogleMapsApiKey;
function setGoogleMapsApiKey(config, androidManifest) {
    const apiKey = getGoogleMapsApiKey(config);
    const mainApplication = Manifest_1.getMainApplicationOrThrow(androidManifest);
    if (apiKey) {
        // If the item exists, add it back
        Manifest_1.addMetaDataItemToMainApplication(mainApplication, META_API_KEY, apiKey);
        Manifest_1.addUsesLibraryItemToMainApplication(mainApplication, {
            name: LIB_HTTP,
            required: false,
        });
    }
    else {
        // Remove any existing item
        Manifest_1.removeMetaDataItemFromMainApplication(mainApplication, META_API_KEY);
        Manifest_1.removeUsesLibraryItemFromMainApplication(mainApplication, LIB_HTTP);
    }
    return androidManifest;
}
exports.setGoogleMapsApiKey = setGoogleMapsApiKey;
//# sourceMappingURL=GoogleMapsApiKey.js.map