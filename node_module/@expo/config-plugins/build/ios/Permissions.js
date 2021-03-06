"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ios_plugins_1 = require("../plugins/ios-plugins");
/**
 * Apply permissions and their respective descriptions to the iOS Info.plist.
 * Providing a null description will remove the permission from the Info.plist.
 *
 * @param config
 * @param permissions record of strings where the key matches Info.plist permissions and the values are the permission descriptions.
 */
exports.withPermissions = (config, permissions) => {
    return ios_plugins_1.withInfoPlist(config, async (config) => {
        config.modResults = applyPermissions(permissions, config.modResults);
        return config;
    });
};
function applyPermissions(permissions, infoPlist) {
    const entries = Object.entries(permissions);
    if (entries.length === 0) {
        // TODO: Debug warn
        // console.warn('[withPermissions] no permissions were provided');
    }
    for (const [permission, description] of entries) {
        if (description == null) {
            delete infoPlist[permission];
        }
        else {
            const existingPermission = infoPlist[permission];
            if (existingPermission && existingPermission !== description) {
                // TODO: Debug warn
                //   console.warn(
                //     `[withPermissionsIos][conflict] permission "${permission}" is already defined in the Info.plist with description "${existingPermission}"`
                //   );
            }
            infoPlist[permission] = description;
        }
    }
    return infoPlist;
}
exports.applyPermissions = applyPermissions;
//# sourceMappingURL=Permissions.js.map