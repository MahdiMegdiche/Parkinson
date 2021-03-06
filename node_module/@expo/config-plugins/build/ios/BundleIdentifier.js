"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plist_1 = __importDefault(require("@expo/plist"));
const assert_1 = __importDefault(require("assert"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const xcode_1 = __importDefault(require("xcode"));
const core_plugins_1 = require("../plugins/core-plugins");
const Paths_1 = require("./Paths");
const Xcodeproj_1 = require("./utils/Xcodeproj");
exports.withBundleIdentifier = (config, { bundleIdentifier }) => {
    return core_plugins_1.withDangerousMod(config, [
        'ios',
        async (config) => {
            var _a;
            const bundleId = bundleIdentifier !== null && bundleIdentifier !== void 0 ? bundleIdentifier : (_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier;
            assert_1.default(bundleId, '`bundleIdentifier` must be defined in the app config (`expo.ios.bundleIdentifier`) or passed to the plugin `withBundleIdentifier`.');
            await setBundleIdentifierForPbxproj(config.modRequest.projectRoot, bundleId);
            return config;
        },
    ]);
};
function getBundleIdentifier(config) {
    var _a, _b;
    return (_b = (_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier) !== null && _b !== void 0 ? _b : null;
}
exports.getBundleIdentifier = getBundleIdentifier;
/**
 * In Turtle v1 we set the bundleIdentifier directly on Info.plist rather
 * than in pbxproj
 */
function setBundleIdentifier(config, infoPlist) {
    const bundleIdentifier = getBundleIdentifier(config);
    if (!bundleIdentifier) {
        return infoPlist;
    }
    return Object.assign(Object.assign({}, infoPlist), { CFBundleIdentifier: bundleIdentifier });
}
exports.setBundleIdentifier = setBundleIdentifier;
/**
 * Gets the bundle identifier of the Xcode project found in the project directory.
 * If either the Xcode project doesn't exist or the project is not configured
 * this function returns null.
 *
 * @param {string} projectRoot Path to project root containing the ios directory
 * @returns {string | null} bundle identifier of the Xcode project or null if the project is not configured
 */
function getBundleIdentifierFromPbxproj(projectRoot) {
    let pbxprojPath;
    try {
        pbxprojPath = Paths_1.getPBXProjectPath(projectRoot);
    }
    catch (_a) {
        return null;
    }
    const project = xcode_1.default.project(pbxprojPath);
    project.parseSync();
    const [, nativeTarget] = Xcodeproj_1.findFirstNativeTarget(project);
    for (const [, item] of Xcodeproj_1.getBuildConfigurationForId(project, nativeTarget.buildConfigurationList)) {
        const bundleIdentifierRaw = item.buildSettings.PRODUCT_BUNDLE_IDENTIFIER;
        if (bundleIdentifierRaw) {
            const bundleIdentifier = bundleIdentifierRaw[0] === '"' ? bundleIdentifierRaw.slice(1, -1) : bundleIdentifierRaw;
            // it's possible to use interpolation for the bundle identifier
            // the most common case is when the last part of the id is set to `$(PRODUCT_NAME:rfc1034identifier)`
            // in this case, PRODUCT_NAME should be replaced with its value
            // the `rfc1034identifier` modifier replaces all non-alphanumeric characters with dashes
            const bundleIdentifierParts = bundleIdentifier.split('.');
            if (bundleIdentifierParts[bundleIdentifierParts.length - 1] ===
                '$(PRODUCT_NAME:rfc1034identifier)' &&
                item.buildSettings.PRODUCT_NAME) {
                bundleIdentifierParts[bundleIdentifierParts.length - 1] = item.buildSettings.PRODUCT_NAME.replace(/[^a-zA-Z0-9]/g, '-');
            }
            return bundleIdentifierParts.join('.');
        }
    }
    return null;
}
exports.getBundleIdentifierFromPbxproj = getBundleIdentifierFromPbxproj;
/**
 * Updates the bundle identifier for a given pbxproj
 *
 * @param {string} pbxprojPath Path to pbxproj file
 * @param {string} bundleIdentifier Bundle identifier to set in the pbxproj
 * @param {boolean} [updateProductName=true]  Whether to update PRODUCT_NAME
 */
function updateBundleIdentifierForPbxproj(pbxprojPath, bundleIdentifier, updateProductName = true) {
    const project = xcode_1.default.project(pbxprojPath);
    project.parseSync();
    const [, nativeTarget] = Xcodeproj_1.findFirstNativeTarget(project);
    Xcodeproj_1.getBuildConfigurationForId(project, nativeTarget.buildConfigurationList).forEach(([, item]) => {
        if (item.buildSettings.PRODUCT_BUNDLE_IDENTIFIER === bundleIdentifier) {
            return;
        }
        item.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = `"${bundleIdentifier}"`;
        if (updateProductName) {
            const productName = bundleIdentifier.split('.').pop();
            if (!(productName === null || productName === void 0 ? void 0 : productName.includes('$'))) {
                item.buildSettings.PRODUCT_NAME = productName;
            }
        }
    });
    fs_extra_1.default.writeFileSync(pbxprojPath, project.writeSync());
}
exports.updateBundleIdentifierForPbxproj = updateBundleIdentifierForPbxproj;
/**
 * Updates the bundle identifier for pbx projects inside the ios directory of the given project root
 *
 * @param {string} projectRoot Path to project root containing the ios directory
 * @param {string} bundleIdentifier Desired bundle identifier
 * @param {boolean} [updateProductName=true]  Whether to update PRODUCT_NAME
 */
function setBundleIdentifierForPbxproj(projectRoot, bundleIdentifier, updateProductName = true) {
    // Get all pbx projects in the ${projectRoot}/ios directory
    let pbxprojPaths = [];
    try {
        pbxprojPaths = Paths_1.getAllPBXProjectPaths(projectRoot);
    }
    catch (_a) { }
    for (const pbxprojPath of pbxprojPaths) {
        updateBundleIdentifierForPbxproj(pbxprojPath, bundleIdentifier, updateProductName);
    }
}
exports.setBundleIdentifierForPbxproj = setBundleIdentifierForPbxproj;
/**
 * Reset bundle identifier field in Info.plist to use PRODUCT_BUNDLE_IDENTIFIER, as recommended by Apple.
 */
const defaultBundleId = '$(PRODUCT_BUNDLE_IDENTIFIER)';
function resetAllPlistBundleIdentifiers(projectRoot) {
    const infoPlistPaths = Paths_1.getAllInfoPlistPaths(projectRoot);
    for (const plistPath of infoPlistPaths) {
        resetPlistBundleIdentifier(plistPath);
    }
}
exports.resetAllPlistBundleIdentifiers = resetAllPlistBundleIdentifiers;
function resetPlistBundleIdentifier(plistPath) {
    const rawPlist = fs_extra_1.default.readFileSync(plistPath, 'utf8');
    const plistObject = plist_1.default.parse(rawPlist);
    if (plistObject.CFBundleIdentifier) {
        if (plistObject.CFBundleIdentifier === defaultBundleId)
            return;
        // attempt to match default Info.plist format
        const format = { pretty: true, indent: `\t` };
        const xml = plist_1.default.build(Object.assign(Object.assign({}, plistObject), { CFBundleIdentifier: defaultBundleId }), format);
        if (xml !== rawPlist) {
            fs_extra_1.default.writeFileSync(plistPath, xml);
        }
    }
}
exports.resetPlistBundleIdentifier = resetPlistBundleIdentifier;
//# sourceMappingURL=BundleIdentifier.js.map