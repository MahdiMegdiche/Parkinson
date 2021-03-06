"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const XML_1 = require("../utils/XML");
const errors_1 = require("../utils/errors");
const warnings_1 = require("../utils/warnings");
const Resources_1 = require("./Resources");
const Strings_1 = require("./Strings");
/**
 * Sanitize a name, this should be used for files and gradle names.
 * - `[/, \, :, <, >, ", ?, *, |]` are not allowed https://bit.ly/3l6xqKL
 *
 * @param name
 */
function sanitizeNameForGradle(name) {
    // Gradle disallows these:
    // The project name 'My-Special 😃 Co/ol_Project' must not contain any of the following characters: [/, \, :, <, >, ", ?, *, |]. Set the 'rootProject.name' or adjust the 'include' statement (see https://docs.gradle.org/6.2/dsl/org.gradle.api.initialization.Settings.html#org.gradle.api.initialization.Settings:include(java.lang.String[]) for more details).
    return name.replace(/(\/|\\|:|<|>|"|\?|\*|\|)/g, '');
}
exports.sanitizeNameForGradle = sanitizeNameForGradle;
exports.withName = android_plugins_1.createStringsXmlPlugin(applyNameFromConfig, 'withName');
exports.withNameSettingsGradle = config => {
    return android_plugins_1.withSettingsGradle(config, config => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = applyNameSettingsGradle(config, config.modResults.contents);
        }
        else {
            warnings_1.addWarningAndroid('android-name-settings-gradle', `Cannot automatically configure settings.gradle if it's not groovy`);
        }
        return config;
    });
};
function getName(config) {
    return typeof config.name === 'string' ? config.name : null;
}
exports.getName = getName;
/**
 * Changes the display name on the home screen,
 * notifications, and others.
 */
async function setName(config, projectRoot) {
    const stringsPath = await Strings_1.getProjectStringsXMLPathAsync(projectRoot);
    errors_1.assert(stringsPath);
    let stringsJSON = await Resources_1.readResourcesXMLAsync({ path: stringsPath });
    stringsJSON = applyNameFromConfig(config, stringsJSON);
    try {
        await XML_1.writeXMLAsync({ path: stringsPath, xml: stringsJSON });
    }
    catch (_a) {
        throw new Error(`Error setting name. Cannot write strings.xml to ${stringsPath}.`);
    }
    return true;
}
exports.setName = setName;
function applyNameFromConfig(config, stringsJSON) {
    const name = getName(config);
    if (name) {
        return Strings_1.setStringItem([Resources_1.buildResourceItem({ name: 'app_name', value: name })], stringsJSON);
    }
    return Strings_1.removeStringItem('app_name', stringsJSON);
}
/**
 * Regex a name change -- fragile.
 *
 * @param config
 * @param settingsGradle
 */
function applyNameSettingsGradle(config, settingsGradle) {
    var _a;
    const name = sanitizeNameForGradle((_a = getName(config)) !== null && _a !== void 0 ? _a : '');
    // Select rootProject.name = '***' and replace the contents between the quotes.
    return settingsGradle.replace(/rootProject.name\s?=\s?(["'])(?:(?=(\\?))\2.)*?\1/g, `rootProject.name = '${name}'`);
}
exports.applyNameSettingsGradle = applyNameSettingsGradle;
//# sourceMappingURL=Name.js.map