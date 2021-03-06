export declare type XMLValue = boolean | number | string | null | XMLArray | XMLObject;
export interface XMLArray extends Array<XMLValue> {
}
export interface XMLObject {
    [key: string]: XMLValue | undefined;
}
export declare function logXMLString(doc: XMLObject): void;
export declare function writeXMLAsync(options: {
    path: string;
    xml: any;
}): Promise<void>;
export declare function writeXMLOrRemoveFileUponNoResourcesAsync(filePath: string, xml: XMLObject, { disregardComments }?: {
    disregardComments?: boolean;
}): Promise<void>;
export declare function readXMLAsync(options: {
    path: string;
    fallback?: string | null;
}): Promise<XMLObject>;
export declare function format(manifest: any, { indentLevel, newline }?: {
    indentLevel?: number | undefined;
    newline?: string | undefined;
}): string;
