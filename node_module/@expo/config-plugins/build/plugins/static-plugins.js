"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getenv_1 = require("getenv");
const errors_1 = require("../utils/errors");
const plugin_resolver_1 = require("../utils/plugin-resolver");
const EXPO_DEBUG = getenv_1.boolish('EXPO_DEBUG', false);
function isModuleMissingError(name, error) {
    // @ts-ignore
    if (error.code === 'MODULE_NOT_FOUND') {
        return true;
    }
    return error.message.includes(`Cannot find module '${name}'`);
}
/**
 * Resolves static module plugin and potentially falls back on a provided plugin if the module cannot be resolved
 *
 * @param config
 * @param fallback Plugin with `_resolverError` explaining why the module couldn't be used
 * @param projectRoot optional project root, fallback to _internal.projectRoot. Used for testing.
 */
exports.withStaticPlugin = (config, props) => {
    var _a;
    let projectRoot = props.projectRoot;
    if (!projectRoot) {
        projectRoot = (_a = config._internal) === null || _a === void 0 ? void 0 : _a.projectRoot;
        plugin_resolver_1.assertInternalProjectRoot(projectRoot);
    }
    let [pluginResolve, pluginProps] = plugin_resolver_1.normalizeStaticPlugin(props.plugin);
    // Ensure no one uses this property by accident.
    errors_1.assert(!(pluginProps === null || pluginProps === void 0 ? void 0 : pluginProps._resolverError), `Plugin property '_resolverError' is a reserved property of \`withStaticPlugin\``);
    let withPlugin;
    // Function was provided, no need to resolve: [withPlugin, {}]
    if (typeof pluginResolve === 'function') {
        withPlugin = pluginResolve;
    }
    else if (typeof pluginResolve === 'string') {
        try {
            // Resolve and evaluate plugins.
            withPlugin = plugin_resolver_1.resolveConfigPluginFunction(projectRoot, pluginResolve);
        }
        catch (error) {
            if (EXPO_DEBUG) {
                if (isModuleMissingError(pluginResolve, error)) {
                    // Prevent causing log spew for basic resolution errors.
                    console.log(`Could not find plugin "${pluginResolve}"`);
                }
                else {
                    // Log the error in debug mode for plugins with fallbacks (like the Expo managed plugins).
                    console.log(`Error resolving plugin "${pluginResolve}"`);
                    console.log(error);
                    console.log();
                }
            }
            // TODO: Maybe allow for `PluginError`s to be thrown so external plugins can assert invalid options.
            // If the static module failed to resolve, attempt to use a fallback.
            // This enables support for built-in plugins with versioned variations living in other packages.
            if (props.fallback) {
                if (!pluginProps)
                    pluginProps = {};
                // Pass this to the fallback plugin for potential warnings about needing to install a versioned package.
                pluginProps._resolverError = error;
                withPlugin = props.fallback;
            }
            else {
                // If no fallback, throw the resolution error.
                throw error;
            }
        }
    }
    else {
        throw new errors_1.PluginError(`Plugin is an unexpected type: ${typeof pluginResolve}`, 'INVALID_PLUGIN_TYPE');
    }
    // Execute the plugin.
    config = withPlugin(config, pluginProps);
    return config;
};
//# sourceMappingURL=static-plugins.js.map