"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
const android_plugins_1 = require("../plugins/android-plugins");
const core_plugins_1 = require("../plugins/core-plugins");
const WarningAggregator = __importStar(require("../utils/warnings"));
const Paths_1 = require("./Paths");
exports.withPackageManifest = android_plugins_1.createAndroidManifestPlugin(setPackageInAndroidManifest, 'withPackageManifest');
exports.withPackageGradle = config => {
    return android_plugins_1.withAppBuildGradle(config, config => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setPackageInBuildGradle(config, config.modResults.contents);
        }
        else {
            WarningAggregator.addWarningAndroid('android-package', `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withPackageRefactor = config => {
    return core_plugins_1.withDangerousMod(config, [
        'android',
        async (config) => {
            await renamePackageOnDisk(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
function getPackage(config) {
    var _a, _b;
    return (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.package) !== null && _b !== void 0 ? _b : null;
}
exports.getPackage = getPackage;
function getPackageRoot(projectRoot) {
    return path_1.default.join(projectRoot, 'android', 'app', 'src', 'main', 'java');
}
async function getCurrentPackageName(projectRoot) {
    const packageRoot = getPackageRoot(projectRoot);
    const mainApplication = await Paths_1.getMainApplicationAsync(projectRoot);
    const packagePath = path_1.default.dirname(mainApplication.path);
    const packagePathParts = path_1.default.relative(packageRoot, packagePath).split(path_1.default.sep).filter(Boolean);
    return packagePathParts.join('.');
}
// NOTE(brentvatne): this assumes that our MainApplication.java file is in the root of the package
// this makes sense for standard react-native projects but may not apply in customized projects, so if
// we want this to be runnable in any app we need to handle other possibilities
async function renamePackageOnDisk(config, projectRoot) {
    const newPackageName = getPackage(config);
    if (newPackageName === null) {
        return;
    }
    const currentPackageName = await getCurrentPackageName(projectRoot);
    if (currentPackageName === newPackageName) {
        return;
    }
    // Set up our paths
    const packageRoot = getPackageRoot(projectRoot);
    const currentPackagePath = path_1.default.join(packageRoot, ...currentPackageName.split('.'));
    const newPackagePath = path_1.default.join(packageRoot, ...newPackageName.split('.'));
    // Create the new directory
    fs_extra_1.default.mkdirpSync(newPackagePath);
    // Move everything from the old directory over
    glob_1.sync('**/*', { cwd: currentPackagePath }).forEach(relativePath => {
        const filepath = path_1.default.join(currentPackagePath, relativePath);
        if (fs_extra_1.default.lstatSync(filepath).isFile()) {
            fs_extra_1.default.moveSync(filepath, path_1.default.join(newPackagePath, relativePath));
        }
        else {
            fs_extra_1.default.mkdirpSync(filepath);
        }
    });
    // Remove the old directory recursively from com/old/package to com/old and com,
    // as long as the directories are empty
    const oldPathParts = currentPackageName.split('.');
    while (oldPathParts.length) {
        const pathToCheck = path_1.default.join(packageRoot, ...oldPathParts);
        try {
            const files = fs_extra_1.default.readdirSync(pathToCheck);
            if (files.length === 0) {
                fs_extra_1.default.rmdirSync(pathToCheck);
            }
        }
        finally {
            oldPathParts.pop();
        }
    }
    const filesToUpdate = [
        ...glob_1.sync('**/*', { cwd: newPackagePath, absolute: true }),
        path_1.default.join(projectRoot, 'android', 'app', 'BUCK'),
    ];
    // Replace all occurrences of the path in the project
    filesToUpdate.forEach((filepath) => {
        try {
            if (fs_extra_1.default.lstatSync(filepath).isFile()) {
                let contents = fs_extra_1.default.readFileSync(filepath).toString();
                contents = contents.replace(new RegExp(currentPackageName, 'g'), newPackageName);
                fs_extra_1.default.writeFileSync(filepath, contents);
            }
        }
        catch (_a) { }
    });
}
exports.renamePackageOnDisk = renamePackageOnDisk;
function setPackageInBuildGradle(config, buildGradle) {
    const packageName = getPackage(config);
    if (packageName === null) {
        return buildGradle;
    }
    const pattern = new RegExp(`applicationId ['"].*['"]`);
    return buildGradle.replace(pattern, `applicationId '${packageName}'`);
}
exports.setPackageInBuildGradle = setPackageInBuildGradle;
function setPackageInAndroidManifest(config, androidManifest) {
    const packageName = getPackage(config);
    if (packageName) {
        androidManifest.manifest.$.package = packageName;
    }
    else {
        delete androidManifest.manifest.$.package;
    }
    return androidManifest;
}
exports.setPackageInAndroidManifest = setPackageInAndroidManifest;
async function getApplicationIdAsync(projectDir) {
    var _a;
    const buildGradlePath = Paths_1.getAppBuildGradle(projectDir);
    if (!(await fs_extra_1.default.pathExists(buildGradlePath))) {
        return null;
    }
    const buildGradle = await fs_extra_1.default.readFile(buildGradlePath, 'utf8');
    const matchResult = buildGradle.match(/applicationId ['"](.*)['"]/);
    // TODO add fallback for legacy cases to read from AndroidManifest.xml
    return (_a = matchResult === null || matchResult === void 0 ? void 0 : matchResult[1]) !== null && _a !== void 0 ? _a : null;
}
exports.getApplicationIdAsync = getApplicationIdAsync;
//# sourceMappingURL=Package.js.map