"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const Serialize_1 = require("../Serialize");
/**
 * Resolves static plugins array as config plugin functions.
 *
 * @param config
 * @param projectRoot
 */
exports.withConfigPlugins = config => {
    var _a;
    // @ts-ignore: plugins not on config type yet -- TODO
    if (!Array.isArray(config.plugins) || !((_a = config.plugins) === null || _a === void 0 ? void 0 : _a.length)) {
        return config;
    }
    // Resolve and evaluate plugins
    // @ts-ignore: TODO: add plugins to the config schema
    config = config_plugins_1.withPlugins(config, config.plugins);
    // plugins aren't serialized by default, serialize the plugins after resolving them.
    return Serialize_1.serializeAfterStaticPlugins(config);
};
//# sourceMappingURL=withConfigPlugins.js.map