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
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
const Scheme_1 = require("./Scheme");
const fbSchemes = ['fbapi', 'fb-messenger-api', 'fbauth2', 'fbshareextension'];
exports.withFacebook = ios_plugins_1.createInfoPlistPlugin(setFacebookConfig, 'withFacebook');
/**
 * Getters
 * TODO: these getters are the same between ios/android, we could reuse them
 */
function getFacebookScheme(config) {
    var _a;
    return (_a = config.facebookScheme) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookScheme = getFacebookScheme;
function getFacebookAppId(config) {
    var _a;
    return (_a = config.facebookAppId) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookAppId = getFacebookAppId;
function getFacebookDisplayName(config) {
    var _a;
    return (_a = config.facebookDisplayName) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookDisplayName = getFacebookDisplayName;
function getFacebookAutoInitEnabled(config) {
    var _a;
    return (_a = config.facebookAutoInitEnabled) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookAutoInitEnabled = getFacebookAutoInitEnabled;
function getFacebookAutoLogAppEvents(config) {
    var _a;
    return (_a = config.facebookAutoLogAppEventsEnabled) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookAutoLogAppEvents = getFacebookAutoLogAppEvents;
function getFacebookAdvertiserIDCollection(config) {
    var _a;
    return (_a = config.facebookAdvertiserIDCollectionEnabled) !== null && _a !== void 0 ? _a : null;
}
exports.getFacebookAdvertiserIDCollection = getFacebookAdvertiserIDCollection;
/**
 * Setters
 */
function setFacebookConfig(config, infoPlist) {
    infoPlist = setFacebookAppId(config, infoPlist);
    infoPlist = setFacebookApplicationQuerySchemes(config, infoPlist);
    infoPlist = setFacebookDisplayName(config, infoPlist);
    infoPlist = setFacebookAutoInitEnabled(config, infoPlist);
    infoPlist = setFacebookAutoLogAppEventsEnabled(config, infoPlist);
    infoPlist = setFacebookAdvertiserIDCollectionEnabled(config, infoPlist);
    infoPlist = setFacebookScheme(config, infoPlist);
    return infoPlist;
}
exports.setFacebookConfig = setFacebookConfig;
function setFacebookScheme(config, infoPlist) {
    const facebookScheme = getFacebookScheme(config);
    return Scheme_1.appendScheme(facebookScheme, infoPlist);
}
exports.setFacebookScheme = setFacebookScheme;
function setFacebookAutoInitEnabled(config, _a) {
    var { FacebookAutoInitEnabled } = _a, infoPlist = __rest(_a, ["FacebookAutoInitEnabled"]);
    const facebookAutoInitEnabled = getFacebookAutoInitEnabled(config);
    if (facebookAutoInitEnabled === null) {
        return infoPlist;
    }
    return Object.assign(Object.assign({}, infoPlist), { FacebookAutoInitEnabled: facebookAutoInitEnabled });
}
exports.setFacebookAutoInitEnabled = setFacebookAutoInitEnabled;
function setFacebookAutoLogAppEventsEnabled(config, _a) {
    var { FacebookAutoLogAppEventsEnabled } = _a, infoPlist = __rest(_a, ["FacebookAutoLogAppEventsEnabled"]);
    const facebookAutoLogAppEventsEnabled = getFacebookAutoLogAppEvents(config);
    if (facebookAutoLogAppEventsEnabled === null) {
        return infoPlist;
    }
    return Object.assign(Object.assign({}, infoPlist), { FacebookAutoLogAppEventsEnabled: facebookAutoLogAppEventsEnabled });
}
exports.setFacebookAutoLogAppEventsEnabled = setFacebookAutoLogAppEventsEnabled;
function setFacebookAdvertiserIDCollectionEnabled(config, _a) {
    var { FacebookAdvertiserIDCollectionEnabled } = _a, infoPlist = __rest(_a, ["FacebookAdvertiserIDCollectionEnabled"]);
    const facebookAdvertiserIDCollectionEnabled = getFacebookAdvertiserIDCollection(config);
    if (facebookAdvertiserIDCollectionEnabled === null) {
        return infoPlist;
    }
    return Object.assign(Object.assign({}, infoPlist), { FacebookAdvertiserIDCollectionEnabled: facebookAdvertiserIDCollectionEnabled });
}
exports.setFacebookAdvertiserIDCollectionEnabled = setFacebookAdvertiserIDCollectionEnabled;
function setFacebookAppId(config, _a) {
    var { FacebookAppID } = _a, infoPlist = __rest(_a, ["FacebookAppID"]);
    const facebookAppId = getFacebookAppId(config);
    if (facebookAppId) {
        return Object.assign(Object.assign({}, infoPlist), { FacebookAppID: facebookAppId });
    }
    return infoPlist;
}
exports.setFacebookAppId = setFacebookAppId;
function setFacebookDisplayName(config, _a) {
    var { FacebookDisplayName } = _a, infoPlist = __rest(_a, ["FacebookDisplayName"]);
    const facebookDisplayName = getFacebookDisplayName(config);
    if (facebookDisplayName) {
        return Object.assign(Object.assign({}, infoPlist), { FacebookDisplayName: facebookDisplayName });
    }
    return infoPlist;
}
exports.setFacebookDisplayName = setFacebookDisplayName;
function setFacebookApplicationQuerySchemes(config, infoPlist) {
    const facebookAppId = getFacebookAppId(config);
    const existingSchemes = infoPlist.LSApplicationQueriesSchemes || [];
    if (facebookAppId && existingSchemes.includes('fbapi')) {
        // already inlcuded, no need to add again
        return infoPlist;
    }
    else if (!facebookAppId && !existingSchemes.length) {
        // already removed, no need to strip again
        const { LSApplicationQueriesSchemes } = infoPlist, restInfoPlist = __rest(infoPlist, ["LSApplicationQueriesSchemes"]);
        if (LSApplicationQueriesSchemes === null || LSApplicationQueriesSchemes === void 0 ? void 0 : LSApplicationQueriesSchemes.length) {
            return infoPlist;
        }
        else {
            // Return without the empty LSApplicationQueriesSchemes array.
            return restInfoPlist;
        }
    }
    // Remove all schemes
    for (const scheme of fbSchemes) {
        const index = existingSchemes.findIndex(s => s === scheme);
        if (index > -1) {
            existingSchemes.splice(index, 1);
        }
    }
    if (!facebookAppId) {
        // Run again to ensure the LSApplicationQueriesSchemes array is stripped if needed.
        infoPlist.LSApplicationQueriesSchemes = existingSchemes;
        if (!infoPlist.LSApplicationQueriesSchemes.length) {
            delete infoPlist.LSApplicationQueriesSchemes;
        }
        return infoPlist;
    }
    // TODO: it's actually necessary to add more query schemes (specific to the
    // app) to support all of the features that the Facebook SDK provides, should
    // we sync those here too?
    const updatedSchemes = [...existingSchemes, ...fbSchemes];
    return Object.assign(Object.assign({}, infoPlist), { LSApplicationQueriesSchemes: updatedSchemes });
}
exports.setFacebookApplicationQuerySchemes = setFacebookApplicationQuerySchemes;
//# sourceMappingURL=Facebook.js.map