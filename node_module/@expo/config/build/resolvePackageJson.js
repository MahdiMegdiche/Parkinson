"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Errors_1 = require("./Errors");
function fileExists(file) {
    try {
        return fs_extra_1.statSync(file).isFile();
    }
    catch (e) {
        return false;
    }
}
function getRootPackageJsonPath(projectRoot) {
    const packageJsonPath = path_1.join(projectRoot, 'package.json');
    if (!fileExists(packageJsonPath)) {
        throw new Errors_1.ConfigError(`The expected package.json path: ${packageJsonPath} does not exist`, 'MODULE_NOT_FOUND');
    }
    return packageJsonPath;
}
exports.getRootPackageJsonPath = getRootPackageJsonPath;
//# sourceMappingURL=resolvePackageJson.js.map