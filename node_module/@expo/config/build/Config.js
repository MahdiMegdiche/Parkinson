"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_file_1 = __importDefault(require("@expo/json-file"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const semver_1 = __importDefault(require("semver"));
const slugify_1 = __importDefault(require("slugify"));
const Errors_1 = require("./Errors");
const Project_1 = require("./Project");
const getConfig_1 = require("./getConfig");
const withConfigPlugins_1 = require("./plugins/withConfigPlugins");
const withInternal_1 = require("./plugins/withInternal");
const resolvePackageJson_1 = require("./resolvePackageJson");
/**
 * If a config has an `expo` object then that will be used as the config.
 * This method reduces out other top level values if an `expo` object exists.
 *
 * @param config Input config object to reduce
 */
function reduceExpoObject(config) {
    var _a;
    if (!config)
        return config === undefined ? null : config;
    const _b = (_a = config.expo) !== null && _a !== void 0 ? _a : config, { mods } = _b, expo = __rest(_b, ["mods"]);
    return {
        expo,
        mods,
    };
}
/**
 * Get all platforms that a project is currently capable of running.
 *
 * @param projectRoot
 * @param exp
 */
function getSupportedPlatforms(projectRoot) {
    const platforms = [];
    if (resolve_from_1.default.silent(projectRoot, 'react-native')) {
        platforms.push('ios', 'android');
    }
    if (resolve_from_1.default.silent(projectRoot, 'react-native-web')) {
        platforms.push('web');
    }
    return platforms;
}
/**
 * Evaluate the config for an Expo project.
 * If a function is exported from the `app.config.js` then a partial config will be passed as an argument.
 * The partial config is composed from any existing app.json, and certain fields from the `package.json` like name and description.
 *
 * If options.isPublicConfig is true, the Expo config will include only public-facing options (omitting private keys).
 * The resulting config should be suitable for hosting or embedding in a publicly readable location.
 *
 * **Example**
 * ```js
 * module.exports = function({ config }) {
 *   // mutate the config before returning it.
 *   config.slug = 'new slug'
 *   return { expo: config };
 * }
 *
 * **Supports**
 * - `app.config.ts`
 * - `app.config.js`
 * - `app.config.json`
 * - `app.json`
 *
 * @param projectRoot the root folder containing all of your application code
 * @param options enforce criteria for a project config
 */
function getConfig(projectRoot, options = {}) {
    const paths = getConfigFilePaths(projectRoot);
    const rawStaticConfig = paths.staticConfigPath ? getConfig_1.getStaticConfig(paths.staticConfigPath) : null;
    // For legacy reasons, always return an object.
    const rootConfig = (rawStaticConfig || {});
    const staticConfig = reduceExpoObject(rawStaticConfig) || {};
    // Can only change the package.json location if an app.json or app.config.json exists
    const [packageJson, packageJsonPath] = getPackageJsonAndPath(projectRoot);
    function fillAndReturnConfig(config, dynamicConfigObjectType) {
        var _a, _b, _c;
        const configWithDefaultValues = Object.assign(Object.assign({}, ensureConfigHasDefaultValues({
            projectRoot,
            exp: config.expo,
            pkg: packageJson,
            skipSDKVersionRequirement: options.skipSDKVersionRequirement,
            paths,
            packageJsonPath,
        })), { mods: config.mods, dynamicConfigObjectType,
            rootConfig, dynamicConfigPath: paths.dynamicConfigPath, staticConfigPath: paths.staticConfigPath });
        if (options.isModdedConfig) {
            // @ts-ignore: Add the mods back to the object.
            configWithDefaultValues.exp.mods = (_a = config.mods) !== null && _a !== void 0 ? _a : null;
        }
        // Apply static json plugins, should be done after _internal
        configWithDefaultValues.exp = withConfigPlugins_1.withConfigPlugins(configWithDefaultValues.exp);
        if (!options.isModdedConfig) {
            // @ts-ignore: Delete mods added by static plugins when they won't have a chance to be evaluated
            delete configWithDefaultValues.exp.mods;
        }
        if (options.isPublicConfig) {
            // Remove internal values with references to user's file paths from the public config.
            delete configWithDefaultValues.exp._internal;
            if (configWithDefaultValues.exp.hooks) {
                delete configWithDefaultValues.exp.hooks;
            }
            if ((_b = configWithDefaultValues.exp.ios) === null || _b === void 0 ? void 0 : _b.config) {
                delete configWithDefaultValues.exp.ios.config;
            }
            if ((_c = configWithDefaultValues.exp.android) === null || _c === void 0 ? void 0 : _c.config) {
                delete configWithDefaultValues.exp.android.config;
            }
        }
        return configWithDefaultValues;
    }
    // Fill in the static config
    function getContextConfig(config) {
        return ensureConfigHasDefaultValues({
            projectRoot,
            exp: config.expo,
            pkg: packageJson,
            skipSDKVersionRequirement: true,
            paths,
            packageJsonPath,
        }).exp;
    }
    if (paths.dynamicConfigPath) {
        // No app.config.json or app.json but app.config.js
        const { exportedObjectType, config: rawDynamicConfig } = getConfig_1.getDynamicConfig(paths.dynamicConfigPath, {
            projectRoot,
            staticConfigPath: paths.staticConfigPath,
            packageJsonPath,
            config: getContextConfig(staticConfig),
        });
        // Allow for the app.config.js to `export default null;`
        // Use `dynamicConfigPath` to detect if a dynamic config exists.
        const dynamicConfig = reduceExpoObject(rawDynamicConfig) || {};
        return fillAndReturnConfig(dynamicConfig, exportedObjectType);
    }
    // No app.config.js but json or no config
    return fillAndReturnConfig(staticConfig || {}, null);
}
exports.getConfig = getConfig;
function getPackageJson(projectRoot) {
    const [pkg] = getPackageJsonAndPath(projectRoot);
    return pkg;
}
exports.getPackageJson = getPackageJson;
function getPackageJsonAndPath(projectRoot) {
    const packageJsonPath = resolvePackageJson_1.getRootPackageJsonPath(projectRoot);
    return [json_file_1.default.read(packageJsonPath), packageJsonPath];
}
function readConfigJson(projectRoot, skipValidation = false, skipNativeValidation = false) {
    const paths = getConfigFilePaths(projectRoot);
    const rawStaticConfig = paths.staticConfigPath ? getConfig_1.getStaticConfig(paths.staticConfigPath) : null;
    const getConfigName = () => {
        if (paths.staticConfigPath)
            return ` \`${path_1.default.basename(paths.staticConfigPath)}\``;
        return '';
    };
    let outputRootConfig = rawStaticConfig;
    if (outputRootConfig === null || typeof outputRootConfig !== 'object') {
        if (skipValidation) {
            outputRootConfig = { expo: {} };
        }
        else {
            throw new Errors_1.ConfigError(`Project at path ${path_1.default.resolve(projectRoot)} does not contain a valid Expo config${getConfigName()}`, 'NOT_OBJECT');
        }
    }
    let exp = outputRootConfig.expo;
    if (exp === null || typeof exp !== 'object') {
        throw new Errors_1.ConfigError(`Property 'expo' in${getConfigName()} for project at path ${path_1.default.resolve(projectRoot)} is not an object. Please make sure${getConfigName()} includes a managed Expo app config like this: ${APP_JSON_EXAMPLE}`, 'NO_EXPO');
    }
    exp = Object.assign({}, exp);
    const [pkg, packageJsonPath] = getPackageJsonAndPath(projectRoot);
    return Object.assign(Object.assign(Object.assign({}, ensureConfigHasDefaultValues({
        projectRoot,
        exp,
        pkg,
        skipSDKVersionRequirement: skipNativeValidation,
        paths,
        packageJsonPath,
    })), { mods: null, dynamicConfigPath: null, dynamicConfigObjectType: null, rootConfig: Object.assign({}, outputRootConfig) }), paths);
}
exports.readConfigJson = readConfigJson;
async function readConfigJsonAsync(projectRoot, skipValidation = false, skipNativeValidation = false) {
    return readConfigJson(projectRoot, skipValidation, skipNativeValidation);
}
exports.readConfigJsonAsync = readConfigJsonAsync;
/**
 * Get the static and dynamic config paths for a project. Also accounts for custom paths.
 *
 * @param projectRoot
 */
function getConfigFilePaths(projectRoot) {
    const customPaths = getCustomConfigFilePaths(projectRoot);
    if (customPaths) {
        return customPaths;
    }
    return {
        dynamicConfigPath: getDynamicConfigFilePath(projectRoot),
        staticConfigPath: getStaticConfigFilePath(projectRoot),
    };
}
exports.getConfigFilePaths = getConfigFilePaths;
function getCustomConfigFilePaths(projectRoot) {
    if (!customConfigPaths[projectRoot]) {
        return null;
    }
    // If the user picks a custom config path, we will only use that and skip searching for a secondary config.
    if (isDynamicFilePath(customConfigPaths[projectRoot])) {
        return {
            dynamicConfigPath: customConfigPaths[projectRoot],
            staticConfigPath: null,
        };
    }
    // Anything that's not js or ts will be treated as json.
    return { staticConfigPath: customConfigPaths[projectRoot], dynamicConfigPath: null };
}
function getDynamicConfigFilePath(projectRoot) {
    for (const fileName of ['app.config.ts', 'app.config.js']) {
        const configPath = path_1.default.join(projectRoot, fileName);
        if (fs_extra_1.default.existsSync(configPath)) {
            return configPath;
        }
    }
    return null;
}
function getStaticConfigFilePath(projectRoot) {
    for (const fileName of ['app.config.json', 'app.json']) {
        const configPath = path_1.default.join(projectRoot, fileName);
        if (fs_extra_1.default.existsSync(configPath)) {
            return configPath;
        }
    }
    return null;
}
// TODO: This should account for dynamic configs
function findConfigFile(projectRoot) {
    let configPath;
    // Check for a custom config path first.
    if (customConfigPaths[projectRoot]) {
        configPath = customConfigPaths[projectRoot];
        // We shouldn't verify if the file exists because
        // the user manually specified that this path should be used.
        return {
            configPath,
            configName: path_1.default.basename(configPath),
            configNamespace: 'expo',
        };
    }
    else {
        // app.config.json takes higher priority over app.json
        configPath = path_1.default.join(projectRoot, 'app.config.json');
        if (!fs_extra_1.default.existsSync(configPath)) {
            configPath = path_1.default.join(projectRoot, 'app.json');
        }
    }
    return {
        configPath,
        configName: path_1.default.basename(configPath),
        configNamespace: 'expo',
    };
}
exports.findConfigFile = findConfigFile;
// TODO: deprecate
function configFilename(projectRoot) {
    return findConfigFile(projectRoot).configName;
}
exports.configFilename = configFilename;
async function readExpRcAsync(projectRoot) {
    const expRcPath = path_1.default.join(projectRoot, '.exprc');
    return await json_file_1.default.readAsync(expRcPath, { json5: true, cantReadFileDefault: {} });
}
exports.readExpRcAsync = readExpRcAsync;
const customConfigPaths = {};
function resetCustomConfigPaths() {
    for (const key of Object.keys(customConfigPaths)) {
        delete customConfigPaths[key];
    }
}
exports.resetCustomConfigPaths = resetCustomConfigPaths;
function setCustomConfigPath(projectRoot, configPath) {
    customConfigPaths[projectRoot] = configPath;
}
exports.setCustomConfigPath = setCustomConfigPath;
/**
 * Attempt to modify an Expo project config.
 * This will only fully work if the project is using static configs only.
 * Otherwise 'warn' | 'fail' will return with a message about why the config couldn't be updated.
 * The potentially modified config object will be returned for testing purposes.
 *
 * @param projectRoot
 * @param modifications modifications to make to an existing config
 * @param readOptions options for reading the current config file
 * @param writeOptions If true, the static config file will not be rewritten
 */
async function modifyConfigAsync(projectRoot, modifications, readOptions = {}, writeOptions = {}) {
    const config = getConfig(projectRoot, readOptions);
    if (config.dynamicConfigPath) {
        // We cannot automatically write to a dynamic config.
        /* Currently we should just use the safest approach possible, informing the user that they'll need to manually modify their dynamic config.
    
        if (config.staticConfigPath) {
          // Both a dynamic and a static config exist.
          if (config.dynamicConfigObjectType === 'function') {
            // The dynamic config exports a function, this means it possibly extends the static config.
          } else {
            // Dynamic config ignores the static config, there isn't a reason to automatically write to it.
            // Instead we should warn the user to add values to their dynamic config.
          }
        }
        */
        return {
            type: 'warn',
            message: `Cannot automatically write to dynamic config at: ${path_1.default.relative(projectRoot, config.dynamicConfigPath)}`,
            config: null,
        };
    }
    else if (config.staticConfigPath) {
        // Static with no dynamic config, this means we can append to the config automatically.
        let outputConfig;
        // If the config has an expo object (app.json) then append the options to that object.
        if (config.rootConfig.expo) {
            outputConfig = Object.assign(Object.assign({}, config.rootConfig), { expo: Object.assign(Object.assign({}, config.rootConfig.expo), modifications) });
        }
        else {
            // Otherwise (app.config.json) just add the config modification to the top most level.
            outputConfig = Object.assign(Object.assign({}, config.rootConfig), modifications);
        }
        if (!writeOptions.dryRun) {
            await json_file_1.default.writeAsync(config.staticConfigPath, outputConfig, { json5: false });
        }
        return { type: 'success', config: outputConfig };
    }
    return { type: 'fail', message: 'No config exists', config: null };
}
exports.modifyConfigAsync = modifyConfigAsync;
const APP_JSON_EXAMPLE = JSON.stringify({
    expo: {
        name: 'My app',
        slug: 'my-app',
        sdkVersion: '...',
    },
});
function ensureConfigHasDefaultValues({ projectRoot, exp, pkg, paths, packageJsonPath, skipSDKVersionRequirement = false, }) {
    var _a, _b, _c;
    if (!exp) {
        exp = {};
    }
    exp = withInternal_1.withInternal(exp, Object.assign(Object.assign({ projectRoot }, (paths !== null && paths !== void 0 ? paths : {})), { packageJsonPath }));
    // Defaults for package.json fields
    const pkgName = typeof pkg.name === 'string' ? pkg.name : path_1.default.basename(projectRoot);
    const pkgVersion = typeof pkg.version === 'string' ? pkg.version : '1.0.0';
    const pkgWithDefaults = Object.assign(Object.assign({}, pkg), { name: pkgName, version: pkgVersion });
    // Defaults for app.json/app.config.js fields
    const name = (_a = exp.name) !== null && _a !== void 0 ? _a : pkgName;
    const slug = (_b = exp.slug) !== null && _b !== void 0 ? _b : slugify_1.default(name.toLowerCase());
    const version = (_c = exp.version) !== null && _c !== void 0 ? _c : pkgVersion;
    let description = exp.description;
    if (!description && typeof pkg.description === 'string') {
        description = pkg.description;
    }
    const expWithDefaults = Object.assign(Object.assign({}, exp), { name, slug, version, description });
    let sdkVersion;
    try {
        sdkVersion = Project_1.getExpoSDKVersion(projectRoot, expWithDefaults);
    }
    catch (error) {
        if (!skipSDKVersionRequirement)
            throw error;
    }
    let platforms = exp.platforms;
    if (!platforms) {
        platforms = getSupportedPlatforms(projectRoot);
    }
    return {
        exp: Object.assign(Object.assign({}, expWithDefaults), { sdkVersion, platforms }),
        pkg: pkgWithDefaults,
    };
}
async function writeConfigJsonAsync(projectRoot, options) {
    const paths = getConfigFilePaths(projectRoot);
    let { exp, pkg, rootConfig, dynamicConfigObjectType, staticConfigPath, } = await readConfigJsonAsync(projectRoot);
    exp = Object.assign(Object.assign({}, rootConfig.expo), options);
    rootConfig = Object.assign(Object.assign({}, rootConfig), { expo: exp });
    if (paths.staticConfigPath) {
        await json_file_1.default.writeAsync(paths.staticConfigPath, rootConfig, { json5: false });
    }
    else {
        console.log('Failed to write to config: ', options);
    }
    return Object.assign({ exp,
        pkg,
        rootConfig,
        staticConfigPath,
        dynamicConfigObjectType }, paths);
}
exports.writeConfigJsonAsync = writeConfigJsonAsync;
const DEFAULT_BUILD_PATH = `web-build`;
function getWebOutputPath(config = {}) {
    var _a, _b;
    if (process.env.WEBPACK_BUILD_OUTPUT_PATH) {
        return process.env.WEBPACK_BUILD_OUTPUT_PATH;
    }
    const expo = config.expo || config || {};
    return ((_b = (_a = expo === null || expo === void 0 ? void 0 : expo.web) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.output) || DEFAULT_BUILD_PATH;
}
exports.getWebOutputPath = getWebOutputPath;
function getNameFromConfig(exp = {}) {
    // For RN CLI support
    const appManifest = exp.expo || exp;
    const { web = {} } = appManifest;
    // rn-cli apps use a displayName value as well.
    const appName = exp.displayName || appManifest.displayName || appManifest.name;
    const webName = web.name || appName;
    return {
        appName,
        webName,
    };
}
exports.getNameFromConfig = getNameFromConfig;
function getDefaultTarget(projectRoot) {
    const { exp } = getConfig(projectRoot, { skipSDKVersionRequirement: true });
    // before SDK 37, always default to managed to preserve previous behavior
    if (exp.sdkVersion && exp.sdkVersion !== 'UNVERSIONED' && semver_1.default.lt(exp.sdkVersion, '37.0.0')) {
        return 'managed';
    }
    return isBareWorkflowProject(projectRoot) ? 'bare' : 'managed';
}
exports.getDefaultTarget = getDefaultTarget;
function isBareWorkflowProject(projectRoot) {
    const [pkg] = getPackageJsonAndPath(projectRoot);
    if (pkg.dependencies && pkg.dependencies.expokit) {
        return false;
    }
    const xcodeprojFiles = glob_1.sync('ios/**/*.xcodeproj', {
        absolute: true,
        cwd: projectRoot,
    });
    if (xcodeprojFiles.length) {
        return true;
    }
    const gradleFiles = glob_1.sync('android/**/*.gradle', {
        absolute: true,
        cwd: projectRoot,
    });
    if (gradleFiles.length) {
        return true;
    }
    return false;
}
/**
 * true if the file is .js or .ts
 *
 * @param filePath
 */
function isDynamicFilePath(filePath) {
    return !!filePath.match(/\.[j|t]s$/);
}
/**
 * Return a useful name describing the project config.
 * - dynamic: app.config.js
 * - static: app.json
 * - custom path app config relative to root folder
 * - both: app.config.js or app.json
 */
function getProjectConfigDescription(projectRoot) {
    const paths = getConfigFilePaths(projectRoot);
    return getProjectConfigDescriptionWithPaths(projectRoot, paths);
}
exports.getProjectConfigDescription = getProjectConfigDescription;
/**
 * Returns a string describing the configurations used for the given project root.
 * Will return null if no config is found.
 *
 * @param projectRoot
 * @param projectConfig
 */
function getProjectConfigDescriptionWithPaths(projectRoot, projectConfig) {
    if (projectConfig.dynamicConfigPath) {
        const relativeDynamicConfigPath = path_1.default.relative(projectRoot, projectConfig.dynamicConfigPath);
        if (projectConfig.staticConfigPath) {
            return `${relativeDynamicConfigPath} or ${path_1.default.relative(projectRoot, projectConfig.staticConfigPath)}`;
        }
        return relativeDynamicConfigPath;
    }
    else if (projectConfig.staticConfigPath) {
        return path_1.default.relative(projectRoot, projectConfig.staticConfigPath);
    }
    // If a config doesn't exist, our tooling will generate a static app.json
    return 'app.json';
}
exports.getProjectConfigDescriptionWithPaths = getProjectConfigDescriptionWithPaths;
__export(require("./Config.types"));
var isLegacyImportsEnabled_1 = require("./isLegacyImportsEnabled");
exports.isLegacyImportsEnabled = isLegacyImportsEnabled_1.isLegacyImportsEnabled;
//# sourceMappingURL=Config.js.map