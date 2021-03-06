import { ExpoConfig } from '@expo/config-types';
import { ConfigPlugin } from '../Plugin.types';
import { InfoPlist } from './IosConfig.types';
export declare const withBundleIdentifier: ConfigPlugin<{
    bundleIdentifier?: string;
}>;
declare function getBundleIdentifier(config: ExpoConfig): string | null;
/**
 * In Turtle v1 we set the bundleIdentifier directly on Info.plist rather
 * than in pbxproj
 */
declare function setBundleIdentifier(config: ExpoConfig, infoPlist: InfoPlist): InfoPlist;
/**
 * Gets the bundle identifier of the Xcode project found in the project directory.
 * If either the Xcode project doesn't exist or the project is not configured
 * this function returns null.
 *
 * @param {string} projectRoot Path to project root containing the ios directory
 * @returns {string | null} bundle identifier of the Xcode project or null if the project is not configured
 */
declare function getBundleIdentifierFromPbxproj(projectRoot: string): string | null;
/**
 * Updates the bundle identifier for a given pbxproj
 *
 * @param {string} pbxprojPath Path to pbxproj file
 * @param {string} bundleIdentifier Bundle identifier to set in the pbxproj
 * @param {boolean} [updateProductName=true]  Whether to update PRODUCT_NAME
 */
declare function updateBundleIdentifierForPbxproj(pbxprojPath: string, bundleIdentifier: string, updateProductName?: boolean): void;
/**
 * Updates the bundle identifier for pbx projects inside the ios directory of the given project root
 *
 * @param {string} projectRoot Path to project root containing the ios directory
 * @param {string} bundleIdentifier Desired bundle identifier
 * @param {boolean} [updateProductName=true]  Whether to update PRODUCT_NAME
 */
declare function setBundleIdentifierForPbxproj(projectRoot: string, bundleIdentifier: string, updateProductName?: boolean): void;
declare function resetAllPlistBundleIdentifiers(projectRoot: string): void;
declare function resetPlistBundleIdentifier(plistPath: string): void;
export { getBundleIdentifier, setBundleIdentifier, getBundleIdentifierFromPbxproj, updateBundleIdentifierForPbxproj, setBundleIdentifierForPbxproj, resetAllPlistBundleIdentifiers, resetPlistBundleIdentifier, };
