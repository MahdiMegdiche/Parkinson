"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_plugins_1 = require("../plugins/android-plugins");
const USES_PERMISSION = 'uses-permission';
exports.requiredPermissions = [
    'android.permission.INTERNET',
    'android.permission.ACCESS_NETWORK_STATE',
    'android.permission.SYSTEM_ALERT_WINDOW',
    'android.permission.WAKE_LOCK',
    'com.google.android.c2dm.permission.RECEIVE',
];
exports.allPermissions = [
    ...exports.requiredPermissions,
    'android.permission.ACCESS_WIFI_STATE',
    'android.permission.ACCESS_COARSE_LOCATION',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.CAMERA',
    'android.permission.MANAGE_DOCUMENTS',
    'android.permission.READ_CONTACTS',
    'android.permission.WRITE_CONTACTS',
    'android.permission.READ_CALENDAR',
    'android.permission.WRITE_CALENDAR',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.READ_INTERNAL_STORAGE',
    'android.permission.READ_PHONE_STATE',
    'android.permission.RECORD_AUDIO',
    'android.permission.USE_FINGERPRINT',
    'android.permission.VIBRATE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.READ_SMS',
    'com.anddoes.launcher.permission.UPDATE_COUNT',
    'com.android.launcher.permission.INSTALL_SHORTCUT',
    'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
    'com.google.android.providers.gsf.permission.READ_GSERVICES',
    'com.htc.launcher.permission.READ_SETTINGS',
    'com.htc.launcher.permission.UPDATE_SHORTCUT',
    'com.majeur.launcher.permission.UPDATE_BADGE',
    'com.sec.android.provider.badge.permission.READ',
    'com.sec.android.provider.badge.permission.WRITE',
    'com.sonyericsson.home.permission.BROADCAST_BADGE',
];
exports.withPermissions = (config, permissions) => {
    if (Array.isArray(permissions)) {
        permissions = permissions.filter(Boolean);
        if (!config.android)
            config.android = {};
        if (!config.android.permissions)
            config.android.permissions = [];
        config.android.permissions = [
            // @ts-ignore
            ...new Set(config.android.permissions.concat(permissions)),
        ];
    }
    return android_plugins_1.withAndroidManifest(config, async (config) => {
        config.modResults = await setAndroidPermissions(config, config.modResults);
        return config;
    });
};
function prefixAndroidPermissionsIfNecessary(permissions) {
    return permissions.map(permission => {
        if (!permission.includes('.')) {
            return `android.permission.${permission}`;
        }
        return permission;
    });
}
function getAndroidPermissions(config) {
    var _a, _b;
    return (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.permissions) !== null && _b !== void 0 ? _b : [];
}
exports.getAndroidPermissions = getAndroidPermissions;
function setAndroidPermissions(config, androidManifest) {
    var _a;
    const permissions = getAndroidPermissions(config);
    let permissionsToAdd = [];
    if (permissions === null) {
        // Use all Expo permissions
        permissionsToAdd = exports.allPermissions;
    }
    else {
        // Use minimum required, plus any specified in permissions array
        const providedPermissions = prefixAndroidPermissionsIfNecessary(permissions);
        permissionsToAdd = [...providedPermissions, ...exports.requiredPermissions];
    }
    if (!androidManifest.manifest.hasOwnProperty('uses-permission')) {
        androidManifest.manifest['uses-permission'] = [];
    }
    // manifest.manifest['uses-permission'] = [];
    const manifestPermissions = (_a = androidManifest.manifest['uses-permission']) !== null && _a !== void 0 ? _a : [];
    permissionsToAdd.forEach(permission => {
        if (!isPermissionAlreadyRequested(permission, manifestPermissions)) {
            addPermissionToManifest(permission, manifestPermissions);
        }
    });
    return androidManifest;
}
exports.setAndroidPermissions = setAndroidPermissions;
function isPermissionAlreadyRequested(permission, manifestPermissions) {
    return manifestPermissions.some(e => e.$['android:name'] === permission);
}
exports.isPermissionAlreadyRequested = isPermissionAlreadyRequested;
function addPermissionToManifest(permission, manifestPermissions) {
    manifestPermissions.push({ $: { 'android:name': permission } });
    return manifestPermissions;
}
exports.addPermissionToManifest = addPermissionToManifest;
function removePermissions(androidManifest, permissionNames) {
    const targetNames = permissionNames ? permissionNames.map(ensurePermissionNameFormat) : null;
    const permissions = androidManifest.manifest[USES_PERMISSION] || [];
    const nextPermissions = [];
    for (const attribute of permissions) {
        if (targetNames) {
            // @ts-ignore: name isn't part of the type
            const value = attribute.$['android:name'] || attribute.$.name;
            if (!targetNames.includes(value)) {
                nextPermissions.push(attribute);
            }
        }
    }
    androidManifest.manifest[USES_PERMISSION] = nextPermissions;
}
exports.removePermissions = removePermissions;
function addPermission(androidManifest, permissionName) {
    const usesPermissions = androidManifest.manifest[USES_PERMISSION] || [];
    usesPermissions.push({
        $: { 'android:name': permissionName },
    });
    androidManifest.manifest[USES_PERMISSION] = usesPermissions;
}
exports.addPermission = addPermission;
function ensurePermissions(androidManifest, permissionNames) {
    const permissions = getPermissions(androidManifest);
    const results = {};
    for (const permissionName of permissionNames) {
        const targetName = ensurePermissionNameFormat(permissionName);
        if (!permissions.includes(targetName)) {
            addPermission(androidManifest, targetName);
            results[permissionName] = true;
        }
        else {
            results[permissionName] = false;
        }
    }
    return results;
}
exports.ensurePermissions = ensurePermissions;
function ensurePermission(androidManifest, permissionName) {
    const permissions = getPermissions(androidManifest);
    const targetName = ensurePermissionNameFormat(permissionName);
    if (!permissions.includes(targetName)) {
        addPermission(androidManifest, targetName);
        return true;
    }
    return false;
}
exports.ensurePermission = ensurePermission;
function ensurePermissionNameFormat(permissionName) {
    if (permissionName.includes('.')) {
        const com = permissionName.split('.');
        const name = com.pop();
        return [...com, name.toUpperCase()].join('.');
    }
    else {
        // If shorthand form like `WRITE_CONTACTS` is provided, expand it to `android.permission.WRITE_CONTACTS`.
        return ensurePermissionNameFormat(`android.permission.${permissionName}`);
    }
}
exports.ensurePermissionNameFormat = ensurePermissionNameFormat;
function getPermissions(androidManifest) {
    const usesPermissions = androidManifest.manifest[USES_PERMISSION] || [];
    const permissions = usesPermissions.map(permissionObject => {
        return permissionObject.$['android:name'] || permissionObject.$.name;
    });
    return permissions;
}
exports.getPermissions = getPermissions;
//# sourceMappingURL=Permissions.js.map