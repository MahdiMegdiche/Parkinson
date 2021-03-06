"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const xml2js_1 = require("xml2js");
function logXMLString(doc) {
    const builder = new xml2js_1.Builder();
    const xmlInput = builder.buildObject(doc);
    console.log(xmlInput);
}
exports.logXMLString = logXMLString;
async function writeXMLAsync(options) {
    const xml = new xml2js_1.Builder().buildObject(options.xml);
    await fs_extra_1.default.ensureDir(path_1.default.dirname(options.path));
    await fs_extra_1.default.writeFile(options.path, xml);
}
exports.writeXMLAsync = writeXMLAsync;
async function removeFileIfExists(filePath) {
    if (await fs_extra_1.default.pathExists(filePath)) {
        await fs_extra_1.default.unlink(filePath);
    }
}
function hasResources(xml) {
    return Array.isArray(xml.resources) && !!xml.resources.length;
}
async function writeXMLOrRemoveFileUponNoResourcesAsync(filePath, xml, { disregardComments } = {}) {
    if (hasResources(xml)) {
        await writeXMLAsync({ path: filePath, xml });
    }
    else {
        await removeFileIfExists(filePath);
    }
}
exports.writeXMLOrRemoveFileUponNoResourcesAsync = writeXMLOrRemoveFileUponNoResourcesAsync;
async function readXMLAsync(options) {
    let contents = '';
    try {
        contents = await fs_extra_1.default.readFile(options.path, { encoding: 'utf8', flag: 'r' });
    }
    catch (_a) {
        // catch and use fallback
    }
    const parser = new xml2js_1.Parser();
    const manifest = await parser.parseStringPromise(contents || options.fallback || '');
    return manifest;
}
exports.readXMLAsync = readXMLAsync;
const stringTimesN = (n, char) => Array(n + 1).join(char);
function format(manifest, { indentLevel = 2, newline = os_1.EOL } = {}) {
    let xmlInput;
    if (typeof manifest === 'string') {
        xmlInput = manifest;
    }
    else if (manifest.toString) {
        const builder = new xml2js_1.Builder({ headless: true });
        xmlInput = builder.buildObject(manifest);
        return xmlInput;
    }
    else {
        throw new Error(`Invalid XML value passed in: ${manifest}`);
    }
    const indentString = stringTimesN(indentLevel, ' ');
    let formatted = '';
    const regex = /(>)(<)(\/*)/g;
    const xml = xmlInput.replace(regex, `$1${newline}$2$3`);
    let pad = 0;
    xml
        .split(/\r?\n/)
        .map((line) => line.trim())
        .forEach((line) => {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        }
        else if (line.match(/^<\/\w/)) {
            // Somehow istanbul doesn't see the else case as covered, although it is. Skip it.
            /* istanbul ignore else  */
            if (pad !== 0) {
                pad -= 1;
            }
        }
        else if (line.match(/^<\w([^>]*[^/])?>.*$/)) {
            indent = 1;
        }
        else {
            indent = 0;
        }
        const padding = stringTimesN(pad, indentString);
        formatted += padding + line + newline; // eslint-disable-line prefer-template
        pad += indent;
    });
    return formatted.trim();
}
exports.format = format;
//# sourceMappingURL=XML.js.map