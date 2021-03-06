"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
exports.withScheme = ios_plugins_1.createInfoPlistPlugin(setScheme, 'withScheme');
function getScheme(config) {
    if (Array.isArray(config.scheme)) {
        const validate = (value) => {
            return typeof value === 'string';
        };
        return config.scheme.filter(validate);
    }
    else if (typeof config.scheme === 'string') {
        return [config.scheme];
    }
    return [];
}
exports.getScheme = getScheme;
function setScheme(config, infoPlist) {
    var _a, _b;
    const scheme = [
        ...getScheme(config),
        // @ts-ignore: TODO: ios.scheme is an unreleased -- harder to add to turtle v1.
        ...getScheme((_a = config.ios) !== null && _a !== void 0 ? _a : {}),
    ];
    // Add the bundle identifier to the list of schemes for easier Google auth and parity with Turtle v1.
    if ((_b = config.ios) === null || _b === void 0 ? void 0 : _b.bundleIdentifier) {
        scheme.push(config.ios.bundleIdentifier);
    }
    if (scheme.length === 0) {
        return infoPlist;
    }
    return Object.assign(Object.assign({}, infoPlist), { CFBundleURLTypes: [{ CFBundleURLSchemes: scheme }] });
}
exports.setScheme = setScheme;
// TODO: update this to be idempotent!
function appendScheme(scheme, infoPlist) {
    if (!scheme) {
        return infoPlist;
    }
    const existingSchemes = infoPlist.CFBundleURLTypes;
    return Object.assign(Object.assign({}, infoPlist), { CFBundleURLTypes: [
            ...(existingSchemes !== null && existingSchemes !== void 0 ? existingSchemes : []),
            {
                CFBundleURLSchemes: [scheme],
            },
        ] });
}
exports.appendScheme = appendScheme;
function removeScheme(scheme, infoPlist) {
    if (!scheme) {
        return infoPlist;
    }
    // No need to remove if we don't have any
    if (!infoPlist.CFBundleURLTypes) {
        return infoPlist;
    }
    infoPlist.CFBundleURLTypes = infoPlist.CFBundleURLTypes.map(bundleUrlType => {
        const index = bundleUrlType.CFBundleURLSchemes.indexOf(scheme);
        if (index > -1) {
            bundleUrlType.CFBundleURLSchemes.splice(index, 1);
            if (bundleUrlType.CFBundleURLSchemes.length === 0) {
                return undefined;
            }
        }
        return bundleUrlType;
    }).filter(Boolean);
    return infoPlist;
}
exports.removeScheme = removeScheme;
function hasScheme(scheme, infoPlist) {
    const existingSchemes = infoPlist.CFBundleURLTypes;
    if (!Array.isArray(existingSchemes))
        return false;
    return existingSchemes.some(({ CFBundleURLSchemes: schemes }) => schemes.includes(scheme));
}
exports.hasScheme = hasScheme;
function getSchemesFromPlist(infoPlist) {
    if (Array.isArray(infoPlist.CFBundleURLTypes)) {
        return infoPlist.CFBundleURLTypes.reduce((schemes, { CFBundleURLSchemes }) => {
            if (Array.isArray(CFBundleURLSchemes)) {
                return [...schemes, ...CFBundleURLSchemes];
            }
            return schemes;
        }, []);
    }
    return [];
}
exports.getSchemesFromPlist = getSchemesFromPlist;
//# sourceMappingURL=Scheme.js.map