"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const android_plugins_1 = require("../plugins/android-plugins");
const core_plugins_1 = require("../plugins/core-plugins");
const WarningAggregator = __importStar(require("../utils/warnings"));
const DEFAULT_TARGET_PATH = './android/app/google-services.json';
const googleServicesClassPath = 'com.google.gms:google-services';
const googleServicesPlugin = 'com.google.gms.google-services';
// NOTE(brentvatne): This may be annoying to keep up to date...
const googleServicesVersion = '4.3.3';
exports.withClassPath = config => {
    return android_plugins_1.withProjectBuildGradle(config, config => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setClassPath(config, config.modResults.contents);
        }
        else {
            WarningAggregator.addWarningAndroid('android-google-services', `Cannot automatically configure project build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withApplyPlugin = config => {
    return android_plugins_1.withAppBuildGradle(config, config => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = applyPlugin(config, config.modResults.contents);
        }
        else {
            WarningAggregator.addWarningAndroid('android-google-services', `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
/**
 * Add `google-services.json` to project
 */
exports.withGoogleServicesFile = config => {
    return core_plugins_1.withDangerousMod(config, [
        'android',
        async (config) => {
            await setGoogleServicesFile(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
function getGoogleServicesFilePath(config) {
    var _a, _b;
    return (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.googleServicesFile) !== null && _b !== void 0 ? _b : null;
}
exports.getGoogleServicesFilePath = getGoogleServicesFilePath;
async function setGoogleServicesFile(config, projectRoot, targetPath = DEFAULT_TARGET_PATH) {
    const partialSourcePath = getGoogleServicesFilePath(config);
    if (!partialSourcePath) {
        return false;
    }
    const completeSourcePath = path_1.resolve(projectRoot, partialSourcePath);
    const destinationPath = path_1.resolve(projectRoot, targetPath);
    try {
        await fs_extra_1.default.copy(completeSourcePath, destinationPath);
    }
    catch (e) {
        throw new Error(`Cannot copy google-services.json from ${completeSourcePath} to ${destinationPath}. Please make sure the source and destination paths exist.`);
    }
    return true;
}
exports.setGoogleServicesFile = setGoogleServicesFile;
/**
 * Adding the Google Services plugin
 * NOTE(brentvatne): string replacement is a fragile approach! we need a
 * better solution than this.
 */
function setClassPath(config, buildGradle) {
    const googleServicesFile = getGoogleServicesFilePath(config);
    if (!googleServicesFile) {
        return buildGradle;
    }
    if (buildGradle.includes(googleServicesClassPath)) {
        return buildGradle;
    }
    //
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
        classpath '${googleServicesClassPath}:${googleServicesVersion}'`);
}
exports.setClassPath = setClassPath;
function applyPlugin(config, appBuildGradle) {
    const googleServicesFile = getGoogleServicesFilePath(config);
    if (!googleServicesFile) {
        return appBuildGradle;
    }
    // Make sure the project does not have the plugin already
    const pattern = new RegExp(`apply\\s+plugin:\\s+['"]${googleServicesPlugin}['"]`);
    if (appBuildGradle.match(pattern)) {
        return appBuildGradle;
    }
    // Add it to the end of the file
    return appBuildGradle + `\napply plugin: '${googleServicesPlugin}'`;
}
exports.applyPlugin = applyPlugin;
//# sourceMappingURL=GoogleServices.js.map