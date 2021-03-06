"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getenv_1 = require("getenv");
const semver_1 = __importDefault(require("semver"));
/**
 * Should the bundler use .expo file extensions.
 *
 * @param exp
 */
function isLegacyImportsEnabled(exp) {
    if (getenv_1.boolish('EXPO_LEGACY_IMPORTS', false)) {
        console.warn('Dangerously enabled the deprecated `.expo` extensions feature, this functionality may be removed between SDK cycles.');
        return true;
    }
    // Only allow target if the SDK version is available and it's less 41.
    // This is optimized for making future projects work.
    return lteSdkVersion(exp, '40.0.0');
}
exports.isLegacyImportsEnabled = isLegacyImportsEnabled;
function lteSdkVersion(expJson, sdkVersion) {
    if (!expJson.sdkVersion) {
        return false;
    }
    if (expJson.sdkVersion === 'UNVERSIONED') {
        return false;
    }
    try {
        return semver_1.default.lte(expJson.sdkVersion, sdkVersion);
    }
    catch (e) {
        throw new Error(`${expJson.sdkVersion} is not a valid version. Must be in the form of x.y.z`);
    }
}
//# sourceMappingURL=isLegacyImportsEnabled.js.map