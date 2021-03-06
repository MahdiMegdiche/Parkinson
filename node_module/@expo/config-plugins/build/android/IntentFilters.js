"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
const android_plugins_1 = require("../plugins/android-plugins");
const Manifest_1 = require("./Manifest");
// TODO: make it so intent filters aren't written again if you run the command again
exports.withAndroidIntentFilters = android_plugins_1.createAndroidManifestPlugin(setAndroidIntentFilters, 'withAndroidIntentFilters');
function getIntentFilters(config) {
    var _a, _b;
    return (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.intentFilters) !== null && _b !== void 0 ? _b : [];
}
exports.getIntentFilters = getIntentFilters;
async function setAndroidIntentFilters(config, androidManifest) {
    var _a;
    const intentFilters = getIntentFilters(config);
    if (!intentFilters.length) {
        return androidManifest;
    }
    const intentFiltersXML = renderIntentFilters(intentFilters).join('');
    const parser = new xml2js_1.Parser();
    const intentFiltersJSON = await parser.parseStringPromise(intentFiltersXML);
    const mainActivity = Manifest_1.getMainActivityOrThrow(androidManifest);
    mainActivity['intent-filter'] = (_a = mainActivity['intent-filter']) === null || _a === void 0 ? void 0 : _a.concat(intentFiltersJSON['intent-filter']);
    return androidManifest;
}
exports.setAndroidIntentFilters = setAndroidIntentFilters;
function renderIntentFilters(intentFilters) {
    // returns an array of <intent-filter> tags:
    // [
    //   `<intent-filter>
    //     <data android:scheme="exp"/>
    //     <data android:scheme="exps"/>
    //
    //     <action android:name="android.intent.action.VIEW"/>
    //
    //     <category android:name="android.intent.category.DEFAULT"/>
    //     <category android:name="android.intent.category.BROWSABLE"/>
    //   </intent-filter>`,
    //   ...
    // ]
    return intentFilters.map(intentFilter => {
        const autoVerify = intentFilter.autoVerify ? ' android:autoVerify="true"' : '';
        return `<intent-filter${autoVerify}>
      ${renderIntentFilterData(intentFilter.data)}
      <action android:name="android.intent.action.${intentFilter.action}"/>
      ${renderIntentFilterCategory(intentFilter.category)}
    </intent-filter>`;
    });
}
exports.default = renderIntentFilters;
function renderIntentFilterDatumEntries(datum = {}) {
    const entries = [];
    for (const [key, value] of Object.entries(datum)) {
        entries.push(`android:${key}="${value}"`);
    }
    return entries.join(' ');
}
function renderIntentFilterData(data) {
    return (Array.isArray(data) ? data : [data])
        .filter(Boolean)
        .map(datum => `<data ${renderIntentFilterDatumEntries(datum)}/>`)
        .join('\n');
}
function renderIntentFilterCategory(category) {
    return (Array.isArray(category) ? category : [category])
        .filter(Boolean)
        .map(cat => `<category android:name="android.intent.category.${cat}"/>`)
        .join('\n');
}
//# sourceMappingURL=IntentFilters.js.map