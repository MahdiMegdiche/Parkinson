"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_plugins_1 = require("../plugins/core-plugins");
const XML_1 = require("../utils/XML");
const WarningAggregator = __importStar(require("../utils/warnings"));
const Colors_1 = require("./Colors");
const Resources_1 = require("./Resources");
const Styles_1 = require("./Styles");
const NAVIGATION_BAR_COLOR = 'navigationBarColor';
const WINDOW_LIGHT_NAVIGATION_BAR = 'android:windowLightNavigationBar';
exports.withNavigationBar = config => {
    return core_plugins_1.withDangerousMod(config, [
        'android',
        async (config) => {
            await setNavigationBarConfig(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
function getNavigationBarImmersiveMode(config) {
    var _a;
    return ((_a = config.androidNavigationBar) === null || _a === void 0 ? void 0 : _a.visible) || null;
}
exports.getNavigationBarImmersiveMode = getNavigationBarImmersiveMode;
function getNavigationBarColor(config) {
    var _a;
    return ((_a = config.androidNavigationBar) === null || _a === void 0 ? void 0 : _a.backgroundColor) || null;
}
exports.getNavigationBarColor = getNavigationBarColor;
function getNavigationBarStyle(config) {
    var _a;
    return ((_a = config.androidNavigationBar) === null || _a === void 0 ? void 0 : _a.barStyle) || 'light-content';
}
exports.getNavigationBarStyle = getNavigationBarStyle;
async function setNavigationBarConfig(config, projectRoot) {
    const immersiveMode = getNavigationBarImmersiveMode(config);
    const hexString = getNavigationBarColor(config);
    const barStyle = getNavigationBarStyle(config);
    const stylesPath = await Styles_1.getProjectStylesXMLPathAsync(projectRoot);
    const colorsPath = await Colors_1.getProjectColorsXMLPathAsync(projectRoot);
    let stylesJSON = await Resources_1.readResourcesXMLAsync({ path: stylesPath });
    let colorsJSON = await Resources_1.readResourcesXMLAsync({ path: colorsPath });
    if (immersiveMode) {
        // Immersive mode needs to be set programatically
        WarningAggregator.addWarningAndroid('androidNavigationBar.visible', 'Hiding the navigation bar must be done programmatically. Refer to the Android documentation - https://developer.android.com/training/system-ui/immersive - for instructions.');
    }
    if (hexString) {
        const colorItemToAdd = Resources_1.buildResourceItem({ name: NAVIGATION_BAR_COLOR, value: hexString });
        colorsJSON = Colors_1.setColorItem(colorItemToAdd, colorsJSON);
        const styleItemToAdd = Resources_1.buildResourceItem({
            name: `android:${NAVIGATION_BAR_COLOR}`,
            value: `@color/${NAVIGATION_BAR_COLOR}`,
        });
        stylesJSON = Styles_1.setStylesItem({
            item: styleItemToAdd,
            xml: stylesJSON,
            parent: { name: 'AppTheme', parent: 'Theme.AppCompat.Light.NoActionBar' },
        });
    }
    if (barStyle === 'dark-content') {
        const navigationBarStyleItem = Resources_1.buildResourceItem({
            name: WINDOW_LIGHT_NAVIGATION_BAR,
            value: 'true',
        });
        stylesJSON = Styles_1.setStylesItem({
            item: navigationBarStyleItem,
            xml: stylesJSON,
            parent: { name: 'AppTheme', parent: 'Theme.AppCompat.Light.NoActionBar' },
        });
    }
    try {
        await Promise.all([
            XML_1.writeXMLAsync({ path: colorsPath, xml: colorsJSON }),
            XML_1.writeXMLAsync({ path: stylesPath, xml: stylesJSON }),
        ]);
    }
    catch (e) {
        throw new Error(`Error setting Android navigation bar color. Cannot write colors.xml to ${colorsPath}, or styles.xml to ${stylesPath}.`);
    }
    return true;
}
exports.setNavigationBarConfig = setNavigationBarConfig;
//# sourceMappingURL=NavigationBar.js.map