import { ExpoConfig } from '@expo/config-types';
import { InfoPlist } from './IosConfig.types';
export declare const withUserInterfaceStyle: import("..").ConfigPlugin<void>;
export declare function getUserInterfaceStyle(config: Pick<ExpoConfig, 'ios' | 'userInterfaceStyle'>): string | null;
export declare function setUserInterfaceStyle(config: Pick<ExpoConfig, 'ios' | 'userInterfaceStyle'>, { UIUserInterfaceStyle, ...infoPlist }: InfoPlist): InfoPlist;
