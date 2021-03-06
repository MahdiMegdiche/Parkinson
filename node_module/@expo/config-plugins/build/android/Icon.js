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
const image_utils_1 = require("@expo/image-utils");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const core_plugins_1 = require("../plugins/core-plugins");
const XML_1 = require("../utils/XML");
const Colors = __importStar(require("./Colors"));
const Resources_1 = require("./Resources");
exports.dpiValues = {
    mdpi: { folderName: 'mipmap-mdpi', scale: 1 },
    hdpi: { folderName: 'mipmap-hdpi', scale: 1.5 },
    xhdpi: { folderName: 'mipmap-xhdpi', scale: 2 },
    xxhdpi: { folderName: 'mipmap-xxhdpi', scale: 3 },
    xxxhdpi: { folderName: 'mipmap-xxxhdpi', scale: 4 },
};
const BASELINE_PIXEL_SIZE = 48;
exports.ANDROID_RES_PATH = 'android/app/src/main/res/';
const MIPMAP_ANYDPI_V26 = 'mipmap-anydpi-v26';
const ICON_BACKGROUND = 'iconBackground';
const IC_LAUNCHER_PNG = 'ic_launcher.png';
const IC_LAUNCHER_ROUND_PNG = 'ic_launcher_round.png';
const IC_LAUNCHER_BACKGROUND_PNG = 'ic_launcher_background.png';
const IC_LAUNCHER_FOREGROUND_PNG = 'ic_launcher_foreground.png';
const IC_LAUNCHER_XML = 'ic_launcher.xml';
const IC_LAUNCHER_ROUND_XML = 'ic_launcher_round.xml';
exports.withIcons = config => {
    return core_plugins_1.withDangerousMod(config, [
        'android',
        async (config) => {
            await setIconAsync(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
function getIcon(config) {
    var _a;
    return config.icon || ((_a = config.android) === null || _a === void 0 ? void 0 : _a.icon) || null;
}
exports.getIcon = getIcon;
function getAdaptiveIcon(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        foregroundImage: (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.adaptiveIcon) === null || _b === void 0 ? void 0 : _b.foregroundImage) !== null && _c !== void 0 ? _c : null,
        backgroundColor: (_f = (_e = (_d = config.android) === null || _d === void 0 ? void 0 : _d.adaptiveIcon) === null || _e === void 0 ? void 0 : _e.backgroundColor) !== null && _f !== void 0 ? _f : null,
        backgroundImage: (_j = (_h = (_g = config.android) === null || _g === void 0 ? void 0 : _g.adaptiveIcon) === null || _h === void 0 ? void 0 : _h.backgroundImage) !== null && _j !== void 0 ? _j : null,
    };
}
exports.getAdaptiveIcon = getAdaptiveIcon;
/**
 * Resizes the user-provided icon to create a set of legacy icon files in
 * their respective "mipmap" directories for <= Android 7, and creates a set of adaptive
 * icon files for > Android 7 from the adaptive icon files (if provided).
 */
async function setIconAsync(config, projectRoot) {
    const { foregroundImage, backgroundColor, backgroundImage } = getAdaptiveIcon(config);
    const icon = foregroundImage !== null && foregroundImage !== void 0 ? foregroundImage : getIcon(config);
    if (!icon) {
        return null;
    }
    await configureLegacyIconAsync(projectRoot, icon, backgroundImage, backgroundColor);
    await configureAdaptiveIconAsync(projectRoot, icon, backgroundImage, backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : '#FFFFFF');
    return true;
}
exports.setIconAsync = setIconAsync;
/**
 * Configures legacy icon files to be used on Android 7 and earlier. If adaptive icon configuration
 * was provided, we create a pseudo-adaptive icon by layering the provided files (or background
 * color if no backgroundImage is provided. If no backgroundImage and no backgroundColor are provided,
 * the background is set to transparent.)
 */
async function configureLegacyIconAsync(projectRoot, icon, backgroundImage, backgroundColor) {
    await Promise.all(Object.values(exports.dpiValues).map(async ({ folderName, scale }) => {
        const dpiFolderPath = path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, folderName);
        const iconSizePx = BASELINE_PIXEL_SIZE * scale;
        // backgroundImage overrides backgroundColor
        backgroundColor = backgroundImage ? 'transparent' : backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : 'transparent';
        let squareIconImage = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-standard-square' }, {
            src: icon,
            width: iconSizePx,
            height: iconSizePx,
            resizeMode: 'cover',
            backgroundColor,
        })).source;
        let roundIconImage = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-standard-circle' }, {
            src: icon,
            width: iconSizePx,
            height: iconSizePx,
            resizeMode: 'cover',
            backgroundColor,
            borderRadius: iconSizePx / 2,
        })).source;
        if (backgroundImage) {
            // Layer the buffers we just created on top of the background image that's provided
            const squareBackgroundLayer = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-standard-square-background' }, {
                src: backgroundImage,
                width: iconSizePx,
                height: iconSizePx,
                resizeMode: 'cover',
                backgroundColor: 'transparent',
            })).source;
            const roundBackgroundLayer = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-standard-round-background' }, {
                src: backgroundImage,
                width: iconSizePx,
                height: iconSizePx,
                resizeMode: 'cover',
                backgroundColor: 'transparent',
                borderRadius: iconSizePx / 2,
            })).source;
            squareIconImage = await image_utils_1.compositeImagesAsync({
                foreground: squareIconImage,
                background: squareBackgroundLayer,
            });
            roundIconImage = await image_utils_1.compositeImagesAsync({
                foreground: roundIconImage,
                background: roundBackgroundLayer,
            });
        }
        await fs_extra_1.default.ensureDir(dpiFolderPath);
        await fs_extra_1.default.writeFile(path_1.default.resolve(dpiFolderPath, IC_LAUNCHER_PNG), squareIconImage);
        await fs_extra_1.default.writeFile(path_1.default.resolve(dpiFolderPath, IC_LAUNCHER_ROUND_PNG), roundIconImage);
    }));
}
/**
 * Configures adaptive icon files to be used on Android 8 and up. A foreground image must be provided,
 * and will have a transparent background unless:
 * - A backgroundImage is provided, or
 * - A backgroundColor was specified
 */
async function configureAdaptiveIconAsync(projectRoot, foregroundImage, backgroundImage, backgroundColor) {
    await setBackgroundColorAsync(projectRoot, backgroundColor);
    await Promise.all(Object.values(exports.dpiValues).map(async ({ folderName, scale }) => {
        const dpiFolderPath = path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, folderName);
        const iconSizePx = BASELINE_PIXEL_SIZE * scale;
        try {
            const adpativeIconForeground = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-adaptive-foreground' }, {
                src: foregroundImage,
                width: iconSizePx,
                height: iconSizePx,
                resizeMode: 'cover',
                backgroundColor: 'transparent',
            })).source;
            await fs_extra_1.default.writeFile(path_1.default.resolve(dpiFolderPath, IC_LAUNCHER_FOREGROUND_PNG), adpativeIconForeground);
            if (backgroundImage) {
                const adpativeIconBackground = (await image_utils_1.generateImageAsync({ projectRoot, cacheType: 'android-adaptive-background' }, {
                    src: backgroundImage,
                    width: iconSizePx,
                    height: iconSizePx,
                    resizeMode: 'cover',
                    backgroundColor: 'transparent',
                })).source;
                await fs_extra_1.default.writeFile(path_1.default.resolve(dpiFolderPath, IC_LAUNCHER_BACKGROUND_PNG), adpativeIconBackground);
            }
            else {
                // Remove any instances of ic_launcher_background.png that are there from previous icons
                await removeBackgroundImageFilesAsync(projectRoot);
            }
        }
        catch (e) {
            throw new Error('Encountered an issue resizing adaptive app icon: ' + e);
        }
    }));
    // create ic_launcher.xml and ic_launcher_round.xml
    const icLauncherXmlString = exports.createAdaptiveIconXmlString(backgroundImage);
    await createAdaptiveIconXmlFiles(projectRoot, icLauncherXmlString);
}
exports.configureAdaptiveIconAsync = configureAdaptiveIconAsync;
async function setBackgroundColorAsync(projectRoot, backgroundColor) {
    const colorsXmlPath = await Colors.getProjectColorsXMLPathAsync(projectRoot);
    let colorsJson = await Resources_1.readResourcesXMLAsync({ path: colorsXmlPath });
    if (backgroundColor) {
        const colorItemToAdd = Resources_1.buildResourceItem({ name: ICON_BACKGROUND, value: backgroundColor });
        colorsJson = Colors.setColorItem(colorItemToAdd, colorsJson);
    }
    else {
        colorsJson = Colors.removeColorItem(ICON_BACKGROUND, colorsJson);
    }
    await XML_1.writeXMLAsync({ path: colorsXmlPath, xml: colorsJson });
}
exports.createAdaptiveIconXmlString = (backgroundImage) => {
    let background = `<background android:drawable="@color/iconBackground"/>`;
    if (backgroundImage) {
        background = `<background android:drawable="@mipmap/ic_launcher_background"/>`;
    }
    return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ${background}
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
};
async function createAdaptiveIconXmlFiles(projectRoot, icLauncherXmlString) {
    const anyDpiV26Directory = path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, MIPMAP_ANYDPI_V26);
    await fs_extra_1.default.ensureDir(anyDpiV26Directory);
    await fs_extra_1.default.writeFile(path_1.default.resolve(anyDpiV26Directory, IC_LAUNCHER_XML), icLauncherXmlString);
    await fs_extra_1.default.writeFile(path_1.default.resolve(anyDpiV26Directory, IC_LAUNCHER_ROUND_XML), icLauncherXmlString);
}
async function removeBackgroundImageFilesAsync(projectRoot) {
    return await Promise.all(Object.values(exports.dpiValues).map(async ({ folderName }) => {
        const dpiFolderPath = path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, folderName);
        await fs_extra_1.default.remove(path_1.default.resolve(dpiFolderPath, IC_LAUNCHER_BACKGROUND_PNG));
    }));
}
//# sourceMappingURL=Icon.js.map