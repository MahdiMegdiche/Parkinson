"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_plugins_1 = require("../plugins/core-plugins");
const XML_1 = require("../utils/XML");
const Colors_1 = require("./Colors");
const Resources_1 = require("./Resources");
const Styles_1 = require("./Styles");
const COLOR_PRIMARY_KEY = 'colorPrimary';
const DEFAULT_PRIMARY_COLOR = '#023c69';
exports.withPrimaryColor = config => {
    return core_plugins_1.withDangerousMod(config, [
        'android',
        async (config) => {
            await setPrimaryColor(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
function getPrimaryColor(config) {
    var _a;
    return (_a = config.primaryColor) !== null && _a !== void 0 ? _a : DEFAULT_PRIMARY_COLOR;
}
exports.getPrimaryColor = getPrimaryColor;
async function setPrimaryColor(config, projectRoot) {
    const hexString = getPrimaryColor(config);
    const stylesPath = await Styles_1.getProjectStylesXMLPathAsync(projectRoot);
    const colorsPath = await Colors_1.getProjectColorsXMLPathAsync(projectRoot);
    let stylesJSON = await Resources_1.readResourcesXMLAsync({ path: stylesPath });
    let colorsJSON = await Resources_1.readResourcesXMLAsync({ path: colorsPath });
    const colorItemToAdd = Resources_1.buildResourceItem({ name: COLOR_PRIMARY_KEY, value: hexString });
    const styleItemToAdd = Resources_1.buildResourceItem({
        name: COLOR_PRIMARY_KEY,
        value: `@color/${COLOR_PRIMARY_KEY}`,
    });
    colorsJSON = Colors_1.setColorItem(colorItemToAdd, colorsJSON);
    stylesJSON = Styles_1.setStylesItem({
        item: styleItemToAdd,
        xml: stylesJSON,
        parent: { name: 'AppTheme', parent: 'Theme.AppCompat.Light.NoActionBar' },
    });
    try {
        await Promise.all([
            XML_1.writeXMLAsync({ path: colorsPath, xml: colorsJSON }),
            XML_1.writeXMLAsync({ path: stylesPath, xml: stylesJSON }),
        ]);
    }
    catch (e) {
        throw new Error(`Error setting Android primary color. Cannot write new styles.xml to ${stylesPath}.`);
    }
    return true;
}
exports.setPrimaryColor = setPrimaryColor;
//# sourceMappingURL=PrimaryColor.js.map