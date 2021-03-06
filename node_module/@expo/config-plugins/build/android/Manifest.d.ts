export declare type StringBoolean = 'true' | 'false';
declare type ManifestMetaDataAttributes = AndroidManifestAttributes & {
    'android:value'?: string;
    'android:resource'?: string;
};
declare type AndroidManifestAttributes = {
    'android:name': string | 'android.intent.action.VIEW';
};
declare type ManifestAction = {
    $: AndroidManifestAttributes;
};
declare type ManifestCategory = {
    $: AndroidManifestAttributes;
};
declare type ManifestData = {
    $: {
        [key: string]: string | undefined;
        'android:host'?: string;
        'android:pathPrefix'?: string;
        'android:scheme'?: string;
    };
};
declare type ManifestReciever = {
    $: AndroidManifestAttributes & {
        'android:exported'?: StringBoolean;
        'android:enabled'?: StringBoolean;
    };
    'intent-filter'?: ManifestIntentFilter[];
};
declare type ManifestIntentFilter = {
    action?: ManifestAction[];
    data?: ManifestData[];
    category?: ManifestCategory[];
};
export declare type ManifestMetaData = {
    $: ManifestMetaDataAttributes;
};
declare type ManifestServiceAttributes = AndroidManifestAttributes & {
    'android:enabled'?: StringBoolean;
    'android:exported'?: StringBoolean;
    'android:permission'?: string;
};
declare type ManifestService = {
    $: ManifestServiceAttributes;
    'intent-filter'?: ManifestIntentFilter[];
};
declare type ManifestApplicationAttributes = {
    'android:name': string | '.MainApplication';
    'android:icon'?: string;
    'android:label'?: string;
    'android:allowBackup'?: StringBoolean;
    'android:largeHeap'?: StringBoolean;
    'android:requestLegacyExternalStorage'?: StringBoolean;
    'android:usesCleartextTraffic'?: StringBoolean;
    [key: string]: string | undefined;
};
export declare type ManifestActivity = {
    $: ManifestApplicationAttributes & {
        'android:exported'?: StringBoolean;
        'android:launchMode'?: string;
        'android:theme'?: string;
        [key: string]: string | undefined;
    };
    'intent-filter'?: ManifestIntentFilter[];
};
export declare type ManifestUsesLibrary = {
    $: AndroidManifestAttributes & {
        'android:required'?: StringBoolean;
    };
};
export declare type ManifestApplication = {
    $: ManifestApplicationAttributes;
    activity?: ManifestActivity[];
    service?: ManifestService[];
    receiver?: ManifestReciever[];
    'meta-data'?: ManifestMetaData[];
    'uses-library'?: ManifestUsesLibrary[];
};
declare type ManifestPermission = {
    $: AndroidManifestAttributes & {
        'android:protectionLevel'?: string | 'signature';
    };
};
export declare type ManifestUsesPermission = {
    $: AndroidManifestAttributes;
};
declare type ManifestUsesFeature = {
    $: AndroidManifestAttributes & {
        'android:glEsVersion'?: string;
        'android:required': StringBoolean;
    };
};
export declare type AndroidManifest = {
    manifest: {
        $: {
            'xmlns:android': string;
            package?: string;
            [key: string]: string | undefined;
        };
        permission?: ManifestPermission[];
        'uses-permission'?: ManifestUsesPermission[];
        'uses-feature'?: ManifestUsesFeature[];
        application?: ManifestApplication[];
    };
};
export declare function writeAndroidManifestAsync(manifestPath: string, androidManifest: AndroidManifest): Promise<void>;
export declare function readAndroidManifestAsync(manifestPath: string): Promise<AndroidManifest>;
export declare function getMainApplication(androidManifest: AndroidManifest): ManifestApplication | null;
export declare function getMainApplicationOrThrow(androidManifest: AndroidManifest): ManifestApplication;
export declare function getMainActivityOrThrow(androidManifest: AndroidManifest): ManifestActivity;
export declare function getMainActivity(androidManifest: AndroidManifest): ManifestActivity | null;
export declare function addMetaDataItemToMainApplication(mainApplication: ManifestApplication, itemName: string, itemValue: string, itemType?: 'resource' | 'value'): ManifestApplication;
export declare function removeMetaDataItemFromMainApplication(mainApplication: any, itemName: string): any;
export declare function findMetaDataItem(mainApplication: any, itemName: string): number;
export declare function findUsesLibraryItem(mainApplication: any, itemName: string): number;
export declare function getMainApplicationMetaDataValue(androidManifest: AndroidManifest, name: string): string | null;
export declare function addUsesLibraryItemToMainApplication(mainApplication: ManifestApplication, item: {
    name: string;
    required?: boolean;
}): ManifestApplication;
export declare function removeUsesLibraryItemFromMainApplication(mainApplication: ManifestApplication, itemName: string): ManifestApplication;
export declare function prefixAndroidKeys<T extends Record<string, any> = Record<string, string>>(head: T): Record<string, any>;
export {};
