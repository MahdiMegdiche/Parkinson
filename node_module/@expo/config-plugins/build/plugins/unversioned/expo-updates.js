"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Updates_1 = require("../../android/Updates");
const Updates_2 = require("../../ios/Updates");
const core_plugins_1 = require("../core-plugins");
const static_plugins_1 = require("../static-plugins");
// Local unversioned updates plugin
const packageName = 'expo-updates';
exports.withUpdates = (config, props) => {
    return static_plugins_1.withStaticPlugin(config, {
        // Pass props to the static plugin if it exists.
        plugin: [packageName, props],
        // If the static plugin isn't found, use the unversioned one.
        fallback: config => withUnversionedUpdates(config, props),
    });
};
const withUnversionedUpdates = core_plugins_1.createRunOncePlugin((config, props) => {
    config = Updates_1.withUpdates(config, props);
    config = Updates_2.withUpdates(config, props);
    return config;
}, packageName);
exports.default = exports.withUpdates;
//# sourceMappingURL=expo-updates.js.map