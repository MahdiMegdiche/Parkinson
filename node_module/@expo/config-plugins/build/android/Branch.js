"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
const META_BRANCH_KEY = 'io.branch.sdk.BranchKey';
exports.withBranch = android_plugins_1.createAndroidManifestPlugin(setBranchApiKey, 'withBranch');
function getBranchApiKey(config) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.branch) === null || _c === void 0 ? void 0 : _c.apiKey) !== null && _d !== void 0 ? _d : null;
}
exports.getBranchApiKey = getBranchApiKey;
function setBranchApiKey(config, androidManifest) {
    const apiKey = getBranchApiKey(config);
    const mainApplication = Manifest_1.getMainApplicationOrThrow(androidManifest);
    if (apiKey) {
        // If the item exists, add it back
        Manifest_1.addMetaDataItemToMainApplication(mainApplication, META_BRANCH_KEY, apiKey);
    }
    else {
        // Remove any existing item
        Manifest_1.removeMetaDataItemFromMainApplication(mainApplication, META_BRANCH_KEY);
    }
    return androidManifest;
}
exports.setBranchApiKey = setBranchApiKey;
//# sourceMappingURL=Branch.js.map