"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const WarningAggregator = __importStar(require("../utils/warnings"));
exports.withScheme = android_plugins_1.createAndroidManifestPlugin(setScheme, 'withScheme');
function getScheme(config) {
    if (Array.isArray(config.scheme)) {
        const validate = (value) => typeof value === 'string';
        return config.scheme.filter(validate);
    }
    else if (typeof config.scheme === 'string') {
        return [config.scheme];
    }
    return [];
}
exports.getScheme = getScheme;
function setScheme(config, androidManifest) {
    var _a, _b;
    const scheme = [
        ...getScheme(config),
        // @ts-ignore: TODO: android.scheme is an unreleased -- harder to add to turtle v1.
        ...getScheme((_a = config.android) !== null && _a !== void 0 ? _a : {}),
    ];
    // Add the package name to the list of schemes for easier Google auth and parity with Turtle v1.
    if ((_b = config.android) === null || _b === void 0 ? void 0 : _b.package) {
        scheme.push(config.android.package);
    }
    if (scheme.length === 0) {
        return androidManifest;
    }
    if (!ensureManifestHasValidIntentFilter(androidManifest)) {
        WarningAggregator.addWarningAndroid('scheme', `Cannot add schemes because the provided manifest does not have a valid Activity with \`android:launchMode="singleTask"\`.\nThis guide can help you get setup properly https://expo.fyi/setup-android-uri-scheme`);
        return androidManifest;
    }
    // Get the current schemes and remove them.
    const currentSchemes = getSchemesFromManifest(androidManifest);
    for (const uri of currentSchemes) {
        androidManifest = removeScheme(uri, androidManifest);
    }
    // Now add all the new schemes.
    for (const uri of scheme) {
        androidManifest = appendScheme(uri, androidManifest);
    }
    return androidManifest;
}
exports.setScheme = setScheme;
function isValidRedirectIntentFilter({ actions, categories, schemes }) {
    return (actions.includes('android.intent.action.VIEW') &&
        !categories.includes('android.intent.category.LAUNCHER'));
}
function propertiesFromIntentFilter(intentFilter) {
    var _a, _b, _c, _d, _e, _f;
    const actions = (_b = (_a = intentFilter === null || intentFilter === void 0 ? void 0 : intentFilter.action) === null || _a === void 0 ? void 0 : _a.map((data) => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.$) === null || _a === void 0 ? void 0 : _a['android:name']; })) !== null && _b !== void 0 ? _b : [];
    const categories = (_d = (_c = intentFilter === null || intentFilter === void 0 ? void 0 : intentFilter.category) === null || _c === void 0 ? void 0 : _c.map((data) => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.$) === null || _a === void 0 ? void 0 : _a['android:name']; })) !== null && _d !== void 0 ? _d : [];
    const schemes = (_f = (_e = intentFilter === null || intentFilter === void 0 ? void 0 : intentFilter.data) === null || _e === void 0 ? void 0 : _e.map((data) => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.$) === null || _a === void 0 ? void 0 : _a['android:scheme']; })) !== null && _f !== void 0 ? _f : [];
    return {
        schemes,
        actions,
        categories,
    };
}
function getSingleTaskIntentFilters(androidManifest) {
    if (!Array.isArray(androidManifest.manifest.application))
        return [];
    let outputSchemes = [];
    for (const application of androidManifest.manifest.application) {
        const { activity } = application;
        // @ts-ignore
        const activities = Array.isArray(activity) ? activity : [activity];
        const singleTaskActivities = activities.filter(activity => { var _a; return ((_a = activity === null || activity === void 0 ? void 0 : activity.$) === null || _a === void 0 ? void 0 : _a['android:launchMode']) === 'singleTask'; });
        for (const activity of singleTaskActivities) {
            const intentFilters = activity['intent-filter'];
            outputSchemes = outputSchemes.concat(intentFilters);
        }
    }
    return outputSchemes;
}
function getSchemesFromManifest(androidManifest) {
    const outputSchemes = [];
    const singleTaskIntentFilters = getSingleTaskIntentFilters(androidManifest);
    for (const intentFilter of singleTaskIntentFilters) {
        const properties = propertiesFromIntentFilter(intentFilter);
        if (isValidRedirectIntentFilter(properties)) {
            outputSchemes.push(properties);
        }
    }
    return outputSchemes.reduce((prev, { schemes }) => [...prev, ...schemes], []);
}
exports.getSchemesFromManifest = getSchemesFromManifest;
function ensureManifestHasValidIntentFilter(androidManifest) {
    var _a;
    if (!Array.isArray(androidManifest.manifest.application)) {
        return false;
    }
    for (const application of androidManifest.manifest.application) {
        for (const activity of application.activity || []) {
            if (((_a = activity === null || activity === void 0 ? void 0 : activity.$) === null || _a === void 0 ? void 0 : _a['android:launchMode']) === 'singleTask') {
                for (const intentFilter of activity['intent-filter'] || []) {
                    // Parse valid intent filters...
                    const properties = propertiesFromIntentFilter(intentFilter);
                    if (isValidRedirectIntentFilter(properties)) {
                        return true;
                    }
                }
                if (!activity['intent-filter']) {
                    activity['intent-filter'] = [];
                }
                activity['intent-filter'].push({
                    action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                    category: [
                        { $: { 'android:name': 'android.intent.category.DEFAULT' } },
                        { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
                    ],
                });
                return true;
            }
        }
    }
    return false;
}
exports.ensureManifestHasValidIntentFilter = ensureManifestHasValidIntentFilter;
function hasScheme(scheme, androidManifest) {
    const schemes = getSchemesFromManifest(androidManifest);
    return schemes.includes(scheme);
}
exports.hasScheme = hasScheme;
function appendScheme(scheme, androidManifest) {
    var _a;
    if (!Array.isArray(androidManifest.manifest.application)) {
        return androidManifest;
    }
    for (const application of androidManifest.manifest.application) {
        for (const activity of application.activity || []) {
            if (((_a = activity === null || activity === void 0 ? void 0 : activity.$) === null || _a === void 0 ? void 0 : _a['android:launchMode']) === 'singleTask') {
                for (const intentFilter of activity['intent-filter'] || []) {
                    const properties = propertiesFromIntentFilter(intentFilter);
                    if (isValidRedirectIntentFilter(properties)) {
                        if (!intentFilter.data)
                            intentFilter.data = [];
                        intentFilter.data.push({
                            $: { 'android:scheme': scheme },
                        });
                    }
                }
                break;
            }
        }
    }
    return androidManifest;
}
exports.appendScheme = appendScheme;
function removeScheme(scheme, androidManifest) {
    var _a, _b, _c, _d;
    if (!Array.isArray(androidManifest.manifest.application)) {
        return androidManifest;
    }
    for (const application of androidManifest.manifest.application) {
        for (const activity of application.activity || []) {
            if (((_a = activity === null || activity === void 0 ? void 0 : activity.$) === null || _a === void 0 ? void 0 : _a['android:launchMode']) === 'singleTask') {
                for (const intentFilter of activity['intent-filter'] || []) {
                    // Parse valid intent filters...
                    const properties = propertiesFromIntentFilter(intentFilter);
                    if (isValidRedirectIntentFilter(properties)) {
                        for (const dataKey in (intentFilter === null || intentFilter === void 0 ? void 0 : intentFilter.data) || []) {
                            const data = (_b = intentFilter.data) === null || _b === void 0 ? void 0 : _b[dataKey];
                            if (((_c = data === null || data === void 0 ? void 0 : data.$) === null || _c === void 0 ? void 0 : _c['android:scheme']) === scheme) {
                                (_d = intentFilter.data) === null || _d === void 0 ? true : delete _d[dataKey];
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    return androidManifest;
}
exports.removeScheme = removeScheme;
//# sourceMappingURL=Scheme.js.map