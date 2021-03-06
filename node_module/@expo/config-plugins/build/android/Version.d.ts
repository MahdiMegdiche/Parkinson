import { ExpoConfig } from '@expo/config-types';
import { ConfigPlugin } from '../Plugin.types';
export declare const withVersion: ConfigPlugin;
export declare function getVersionName(config: Pick<ExpoConfig, 'version'>): string | null;
export declare function setVersionName(config: Pick<ExpoConfig, 'version'>, buildGradle: string): string;
export declare function getVersionCode(config: Pick<ExpoConfig, 'android'>): number | null;
export declare function setVersionCode(config: Pick<ExpoConfig, 'android'>, buildGradle: string): string;
