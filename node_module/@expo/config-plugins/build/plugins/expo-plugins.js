"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AndroidConfig = __importStar(require("../android"));
const IOSConfig = __importStar(require("../ios"));
const core_plugins_1 = require("./core-plugins");
const expo_ads_admob_1 = __importDefault(require("./unversioned/expo-ads-admob"));
const expo_branch_1 = __importDefault(require("./unversioned/expo-branch"));
const expo_facebook_1 = __importDefault(require("./unversioned/expo-facebook"));
const expo_notifications_1 = __importDefault(require("./unversioned/expo-notifications"));
const expo_splash_screen_1 = __importDefault(require("./unversioned/expo-splash-screen"));
const expo_updates_1 = __importDefault(require("./unversioned/expo-updates"));
/**
 * Config plugin to apply all of the custom Expo iOS config plugins we support by default.
 * TODO: In the future most of this should go into versioned packages like expo-facebook, expo-updates, etc...
 */
exports.withExpoIOSPlugins = (config, { bundleIdentifier }) => {
    // Set the bundle ID ahead of time.
    if (!config.ios)
        config.ios = {};
    config.ios.bundleIdentifier = bundleIdentifier;
    return core_plugins_1.withPlugins(config, [
        [IOSConfig.BundleIdentifier.withBundleIdentifier, { bundleIdentifier }],
        IOSConfig.Google.withGoogle,
        IOSConfig.Name.withDisplayName,
        // IOSConfig.Name.withName,
        IOSConfig.Orientation.withOrientation,
        IOSConfig.RequiresFullScreen.withRequiresFullScreen,
        IOSConfig.Scheme.withScheme,
        IOSConfig.UserInterfaceStyle.withUserInterfaceStyle,
        IOSConfig.UsesNonExemptEncryption.withUsesNonExemptEncryption,
        IOSConfig.Version.withBuildNumber,
        IOSConfig.Version.withVersion,
        IOSConfig.Google.withGoogleServicesFile,
        // Entitlements
        IOSConfig.Entitlements.withAppleSignInEntitlement,
        IOSConfig.Entitlements.withAccessesContactNotes,
        // TODO: We don't have a mechanism for getting the apple team id here yet
        [IOSConfig.Entitlements.withICloudEntitlement, { appleTeamId: 'TODO-GET-APPLE-TEAM-ID' }],
        IOSConfig.Entitlements.withAssociatedDomains,
        // XcodeProject
        IOSConfig.DeviceFamily.withDeviceFamily,
        IOSConfig.Locales.withLocales,
        // Dangerous
        IOSConfig.Icons.withIcons,
    ]);
};
/**
 * Config plugin to apply all of the custom Expo Android config plugins we support by default.
 * TODO: In the future most of this should go into versioned packages like expo-facebook, expo-updates, etc...
 */
exports.withExpoAndroidPlugins = (config, props) => {
    // Set the package name ahead of time.
    if (!config.android)
        config.android = {};
    config.android.package = props.package;
    return core_plugins_1.withPlugins(config, [
        // settings.gradle
        AndroidConfig.Name.withNameSettingsGradle,
        // project build.gradle
        AndroidConfig.GoogleServices.withClassPath,
        // app/build.gradle
        AndroidConfig.GoogleServices.withApplyPlugin,
        AndroidConfig.Package.withPackageGradle,
        AndroidConfig.Version.withVersion,
        // AndroidManifest.xml
        AndroidConfig.Package.withPackageManifest,
        AndroidConfig.AllowBackup.withAllowBackup,
        AndroidConfig.Scheme.withScheme,
        AndroidConfig.Orientation.withOrientation,
        AndroidConfig.Permissions.withPermissions,
        AndroidConfig.UserInterfaceStyle.withUiModeManifest,
        AndroidConfig.GoogleMapsApiKey.withGoogleMapsApiKey,
        AndroidConfig.IntentFilters.withAndroidIntentFilters,
        // MainActivity.*
        AndroidConfig.UserInterfaceStyle.withUiModeMainActivity,
        // strings.xml
        AndroidConfig.Name.withName,
        // Dangerous -- these plugins run in reverse order.
        AndroidConfig.GoogleServices.withGoogleServicesFile,
        // Modify colors.xml and styles.xml
        AndroidConfig.RootViewBackgroundColor.withRootViewBackgroundColor,
        AndroidConfig.NavigationBar.withNavigationBar,
        AndroidConfig.StatusBar.withStatusBar,
        AndroidConfig.PrimaryColor.withPrimaryColor,
        AndroidConfig.Icon.withIcons,
        // If we renamed the package, we should also move it around and rename it in source files
        // Added last to ensure this plugin runs first. Out of tree solutions will mistakenly resolve the package incorrectly otherwise.
        AndroidConfig.Package.withPackageRefactor,
    ]);
};
exports.withExpoVersionedSDKPlugins = (config, { expoUsername }) => {
    return core_plugins_1.withPlugins(config, [
        expo_ads_admob_1.default,
        expo_notifications_1.default,
        [expo_updates_1.default, { expoUsername }],
        expo_branch_1.default,
        expo_facebook_1.default,
        expo_splash_screen_1.default,
    ]);
};
//# sourceMappingURL=expo-plugins.js.map