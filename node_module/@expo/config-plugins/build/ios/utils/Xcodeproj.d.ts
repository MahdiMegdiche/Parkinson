import { ExpoConfig } from '@expo/config-types';
import xcode, { PBXGroup, PBXNativeTarget, PBXProject, XCBuildConfiguration, XCConfigurationList, XcodeProject } from 'xcode';
export declare type ProjectSectionEntry = [string, PBXProject];
export declare type NativeTargetSection = Record<string, PBXNativeTarget>;
export declare type NativeTargetSectionEntry = [string, PBXNativeTarget];
export declare type ConfigurationLists = Record<string, XCConfigurationList>;
export declare type ConfigurationListEntry = [string, XCConfigurationList];
export declare type ConfigurationSectionEntry = [string, XCBuildConfiguration];
export declare function getProjectName(projectRoot: string): string;
export declare function getHackyProjectName(projectRoot: string, config: ExpoConfig): string;
export declare function addResourceFileToGroup(filepath: string, groupName: string, project: XcodeProject): XcodeProject;
export declare function getApplicationNativeTarget({ project, projectName, }: {
    project: XcodeProject;
    projectName: string;
}): {
    uuid: string;
    target: xcode.PBXNativeTarget;
};
/**
 * Add a framework to the default app native target.
 *
 * @param projectName Name of the PBX project.
 * @param framework String ending in `.framework`, i.e. `StoreKit.framework`
 */
export declare function addFramework({ project, projectName, framework, }: {
    project: XcodeProject;
    projectName: string;
    framework: string;
}): unknown;
export declare function ensureGroupRecursively(project: XcodeProject, filepath: string): PBXGroup | null;
/**
 * Get the pbxproj for the given path
 */
export declare function getPbxproj(projectRoot: string): XcodeProject;
/**
 * Get the productName for a project, if the name is using a variable `$(TARGET_NAME)`, then attempt to get the value of that variable.
 *
 * @param project
 */
export declare function getProductName(project: XcodeProject): string;
export declare function getProjectSection(project: XcodeProject): Record<string, xcode.PBXProject> & Record<string, string>;
export declare function getNativeTargets(project: XcodeProject): NativeTargetSectionEntry[];
export declare function findFirstNativeTarget(project: XcodeProject): NativeTargetSectionEntry;
export declare function findNativeTargetByName(project: XcodeProject, targetName: string): NativeTargetSectionEntry;
export declare function getXCConfigurationListEntries(project: XcodeProject): ConfigurationListEntry[];
export declare function getBuildConfigurationForId(project: XcodeProject, configurationListId: string): ConfigurationSectionEntry[];
export declare function isBuildConfig([, sectionItem]: ConfigurationSectionEntry): boolean;
export declare function isNotTestHost([, sectionItem]: ConfigurationSectionEntry): boolean;
export declare function isNotComment([key]: ConfigurationSectionEntry | ProjectSectionEntry | ConfigurationListEntry | NativeTargetSectionEntry): boolean;
