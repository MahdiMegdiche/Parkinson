"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * For internal use in Expo CLI
 */
const AndroidConfig = __importStar(require("./android"));
exports.AndroidConfig = AndroidConfig;
const IOSConfig = __importStar(require("./ios"));
exports.IOSConfig = IOSConfig;
const XML = __importStar(require("./utils/XML"));
exports.XML = XML;
const History = __importStar(require("./utils/history"));
exports.History = History;
const WarningAggregator = __importStar(require("./utils/warnings"));
exports.WarningAggregator = WarningAggregator;
var expo_plugins_1 = require("./plugins/expo-plugins");
exports.withExpoIOSPlugins = expo_plugins_1.withExpoIOSPlugins;
exports.withExpoAndroidPlugins = expo_plugins_1.withExpoAndroidPlugins;
exports.withExpoVersionedSDKPlugins = expo_plugins_1.withExpoVersionedSDKPlugins;
/**
 * These are the "config-plugins"
 */
__export(require("./Plugin.types"));
var core_plugins_1 = require("./plugins/core-plugins");
exports.withPlugins = core_plugins_1.withPlugins;
exports.withRunOnce = core_plugins_1.withRunOnce;
exports.createRunOncePlugin = core_plugins_1.createRunOncePlugin;
exports.withDangerousMod = core_plugins_1.withDangerousMod;
exports.withExtendedMod = core_plugins_1.withExtendedMod;
exports.withInterceptedMod = core_plugins_1.withInterceptedMod;
var ios_plugins_1 = require("./plugins/ios-plugins");
exports.withAppDelegate = ios_plugins_1.withAppDelegate;
exports.withInfoPlist = ios_plugins_1.withInfoPlist;
exports.withEntitlementsPlist = ios_plugins_1.withEntitlementsPlist;
exports.withExpoPlist = ios_plugins_1.withExpoPlist;
exports.withXcodeProject = ios_plugins_1.withXcodeProject;
var android_plugins_1 = require("./plugins/android-plugins");
exports.withAndroidManifest = android_plugins_1.withAndroidManifest;
exports.withStringsXml = android_plugins_1.withStringsXml;
exports.withMainActivity = android_plugins_1.withMainActivity;
exports.withProjectBuildGradle = android_plugins_1.withProjectBuildGradle;
exports.withAppBuildGradle = android_plugins_1.withAppBuildGradle;
exports.withSettingsGradle = android_plugins_1.withSettingsGradle;
var static_plugins_1 = require("./plugins/static-plugins");
exports.withStaticPlugin = static_plugins_1.withStaticPlugin;
var mod_compiler_1 = require("./plugins/mod-compiler");
exports.compileModsAsync = mod_compiler_1.compileModsAsync;
var errors_1 = require("./utils/errors");
exports.PluginError = errors_1.PluginError;
//# sourceMappingURL=index.js.map