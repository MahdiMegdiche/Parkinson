"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const require_from_string_1 = __importDefault(require("require-from-string"));
const Errors_1 = require("./Errors");
const Serialize_1 = require("./Serialize");
/**
 * Transpile and evaluate the dynamic config object.
 * This method is shared between the standard reading method in getConfig, and the headless script.
 *
 * @param options configFile path to the dynamic app.config.*, request to send to the dynamic config if it exports a function.
 * @returns the serialized and evaluated config along with the exported object type (object or function).
 */
function evalConfig(configFile, request) {
    const babel = require('@babel/core');
    const preset = require('@expo/babel-preset-cli');
    const { code } = babel.transformFileSync(configFile, {
        // only: [configFile],
        cwd: (request === null || request === void 0 ? void 0 : request.projectRoot) || process.cwd(),
        babelrc: false,
        configFile: false,
        comments: false,
        ignore: [/node_modules/],
        filename: 'unknown',
        presets: [preset],
    });
    const result = require_from_string_1.default(code, configFile);
    return resolveConfigExport(result, configFile, request);
}
exports.evalConfig = evalConfig;
/**
 * - Resolve the exported contents of an Expo config (be it default or module.exports)
 * - Assert no promise exports
 * - Return config type
 * - Serialize config
 *
 * @param result
 * @param configFile
 * @param request
 */
function resolveConfigExport(result, configFile, request) {
    if (result.default != null) {
        result = result.default;
    }
    const exportedObjectType = typeof result;
    if (typeof result === 'function') {
        result = result(request);
    }
    if (result instanceof Promise) {
        throw new Errors_1.ConfigError(`Config file ${configFile} cannot return a Promise.`, 'INVALID_CONFIG');
    }
    // If the expo object exists, ignore all other values.
    if (result === null || result === void 0 ? void 0 : result.expo) {
        result = Serialize_1.serializeSkippingMods(result.expo);
    }
    else {
        result = Serialize_1.serializeSkippingMods(result);
    }
    return { config: result, exportedObjectType };
}
exports.resolveConfigExport = resolveConfigExport;
//# sourceMappingURL=evalConfig.js.map