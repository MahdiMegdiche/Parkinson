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
const json_file_1 = __importDefault(require("@expo/json-file"));
const fs = __importStar(require("fs-extra"));
const path_1 = require("path");
const ios_plugins_1 = require("../plugins/ios-plugins");
const WarningAggregator = __importStar(require("../utils/warnings"));
const Xcodeproj_1 = require("./utils/Xcodeproj");
exports.withLocales = config => {
    return ios_plugins_1.withXcodeProject(config, async (config) => {
        config.modResults = await setLocalesAsync(config, {
            projectRoot: config.modRequest.projectRoot,
            project: config.modResults,
        });
        return config;
    });
};
function getLocales(config) {
    var _a;
    return (_a = config.locales) !== null && _a !== void 0 ? _a : null;
}
exports.getLocales = getLocales;
async function setLocalesAsync(config, { projectRoot, project }) {
    const locales = getLocales(config);
    if (!locales) {
        return project;
    }
    // possibly validate CFBundleAllowMixedLocalizations is enabled
    const localesMap = await getResolvedLocalesAsync(projectRoot, locales);
    const projectName = Xcodeproj_1.getProjectName(projectRoot);
    const supportingDirectory = path_1.join(projectRoot, 'ios', projectName, 'Supporting');
    // TODO: Should we delete all before running? Revisit after we land on a lock file.
    const stringName = 'InfoPlist.strings';
    for (const [lang, localizationObj] of Object.entries(localesMap)) {
        const dir = path_1.join(supportingDirectory, `${lang}.lproj`);
        await fs.ensureDir(dir);
        const strings = path_1.join(dir, stringName);
        const buffer = [];
        for (const [plistKey, localVersion] of Object.entries(localizationObj)) {
            buffer.push(`${plistKey} = "${localVersion}";`);
        }
        // Write the file to the file system.
        await fs.writeFile(strings, buffer.join('\n'));
        // deep find the correct folder
        const group = Xcodeproj_1.ensureGroupRecursively(project, `${projectName}/Supporting/${lang}.lproj`);
        // Ensure the file doesn't already exist
        if (!(group === null || group === void 0 ? void 0 : group.children.some(({ comment }) => comment === stringName))) {
            // Only write the file if it doesn't already exist.
            project = Xcodeproj_1.addResourceFileToGroup(strings, `${projectName}/Supporting/${lang}.lproj`, project);
        }
    }
    return project;
}
exports.setLocalesAsync = setLocalesAsync;
async function getResolvedLocalesAsync(projectRoot, input) {
    const locales = {};
    for (const [lang, localeJsonPath] of Object.entries(input)) {
        if (typeof localeJsonPath === 'string') {
            try {
                locales[lang] = await json_file_1.default.readAsync(path_1.join(projectRoot, localeJsonPath));
            }
            catch (e) {
                // Add a warning when a json file cannot be parsed.
                WarningAggregator.addWarningIOS(`locales-${lang}`, `Failed to parse JSON of locale file for language: ${lang}`, 'https://docs.expo.io/distribution/app-stores/#localizing-your-ios-app');
            }
        }
        else {
            // In the off chance that someone defined the locales json in the config, pass it directly to the object.
            // We do this to make the types more elegant.
            locales[lang] = localeJsonPath;
        }
    }
    return locales;
}
exports.getResolvedLocalesAsync = getResolvedLocalesAsync;
//# sourceMappingURL=Locales.js.map