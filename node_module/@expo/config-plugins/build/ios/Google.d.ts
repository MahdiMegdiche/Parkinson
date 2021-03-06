import { ExpoConfig } from '@expo/config-types';
import { XcodeProject } from 'xcode';
import { ConfigPlugin } from '../Plugin.types';
import { InfoPlist } from './IosConfig.types';
export declare const withGoogle: ConfigPlugin<void>;
export declare const withGoogleServicesFile: ConfigPlugin;
export declare function getGoogleMapsApiKey(config: Pick<ExpoConfig, 'ios'>): string | null;
export declare function getGoogleSignInReservedClientId(config: Pick<ExpoConfig, 'ios'>): string | null;
export declare function getGoogleServicesFile(config: Pick<ExpoConfig, 'ios'>): string | null;
export declare function setGoogleMapsApiKey(config: Pick<ExpoConfig, 'ios'>, { GMSApiKey, ...infoPlist }: InfoPlist): InfoPlist;
export declare function setGoogleSignInReservedClientId(config: Pick<ExpoConfig, 'ios'>, infoPlist: InfoPlist): InfoPlist;
export declare function setGoogleConfig(config: Pick<ExpoConfig, 'ios'>, infoPlist: InfoPlist): InfoPlist;
export declare function setGoogleServicesFile(config: Pick<ExpoConfig, 'ios'>, { projectRoot, project }: {
    project: XcodeProject;
    projectRoot: string;
}): XcodeProject;
