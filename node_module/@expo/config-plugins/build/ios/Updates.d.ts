import { ExpoConfig } from '@expo/config-types';
import xcode from 'xcode';
import { ConfigPlugin } from '../Plugin.types';
import { ExpoPlist } from './IosConfig.types';
declare type ExpoConfigUpdates = Pick<ExpoConfig, 'sdkVersion' | 'owner' | 'runtimeVersion' | 'updates' | 'slug'>;
export declare enum Config {
    ENABLED = "EXUpdatesEnabled",
    CHECK_ON_LAUNCH = "EXUpdatesCheckOnLaunch",
    LAUNCH_WAIT_MS = "EXUpdatesLaunchWaitMs",
    RUNTIME_VERSION = "EXUpdatesRuntimeVersion",
    SDK_VERSION = "EXUpdatesSDKVersion",
    UPDATE_URL = "EXUpdatesURL"
}
export declare function getUpdateUrl(config: Pick<ExpoConfigUpdates, 'owner' | 'slug'>, username: string | null): string | null;
export declare function getRuntimeVersion(config: Pick<ExpoConfigUpdates, 'runtimeVersion'>): string | null;
export declare function getSDKVersion(config: Pick<ExpoConfigUpdates, 'sdkVersion'>): string | null;
export declare function getUpdatesEnabled(config: Pick<ExpoConfigUpdates, 'updates'>): boolean;
export declare function getUpdatesTimeout(config: Pick<ExpoConfigUpdates, 'updates'>): number;
export declare function getUpdatesCheckOnLaunch(config: Pick<ExpoConfigUpdates, 'updates'>): 'NEVER' | 'ALWAYS';
export declare const withUpdates: ConfigPlugin<{
    expoUsername: string | null;
}>;
export declare function setUpdatesConfig(config: ExpoConfigUpdates, expoPlist: ExpoPlist, username: string | null): ExpoPlist;
export declare function setVersionsConfig(config: ExpoConfigUpdates, expoPlist: ExpoPlist): ExpoPlist;
interface ShellScriptBuildPhase {
    isa: 'PBXShellScriptBuildPhase';
    name: string;
    shellScript: string;
    [key: string]: any;
}
export declare function getBundleReactNativePhase(project: xcode.XcodeProject): ShellScriptBuildPhase;
export declare function ensureBundleReactNativePhaseContainsConfigurationScript(projectRoot: string, project: xcode.XcodeProject): xcode.XcodeProject;
export declare function isShellScriptBuildPhaseConfigured(projectRoot: string, project: xcode.XcodeProject): boolean;
export declare function isPlistConfigurationSet(expoPlist: ExpoPlist): boolean;
export declare function isPlistConfigurationSynced(config: ExpoConfigUpdates, expoPlist: ExpoPlist, username: string | null): boolean;
export declare function isPlistVersionConfigurationSynced(config: Pick<ExpoConfigUpdates, 'sdkVersion' | 'runtimeVersion'>, expoPlist: ExpoPlist): boolean;
export {};
