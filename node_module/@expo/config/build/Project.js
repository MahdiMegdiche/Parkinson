"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_file_1 = __importDefault(require("@expo/json-file"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const Errors_1 = require("./Errors");
function getExpoSDKVersion(projectRoot, exp) {
    if (exp === null || exp === void 0 ? void 0 : exp.sdkVersion) {
        return exp.sdkVersion;
    }
    const packageJsonPath = resolve_from_1.default.silent(projectRoot, 'expo/package.json');
    if (packageJsonPath) {
        const expoPackageJson = json_file_1.default.read(packageJsonPath, { json5: true });
        const { version: packageVersion } = expoPackageJson;
        if (typeof packageVersion === 'string') {
            const majorVersion = packageVersion.split('.').shift();
            return `${majorVersion}.0.0`;
        }
    }
    throw new Errors_1.ConfigError(`Cannot determine which native SDK version your project uses because the module \`expo\` is not installed. Please install it with \`yarn add expo\` and try again.`, 'MODULE_NOT_FOUND');
}
exports.getExpoSDKVersion = getExpoSDKVersion;
//# sourceMappingURL=Project.js.map