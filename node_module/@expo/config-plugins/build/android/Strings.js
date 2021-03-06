"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Paths_1 = require("./Paths");
async function getProjectStringsXMLPathAsync(projectRoot, { kind } = {}) {
    return Paths_1.getResourceXMLPathAsync(projectRoot, { kind, name: 'strings' });
}
exports.getProjectStringsXMLPathAsync = getProjectStringsXMLPathAsync;
function setStringItem(itemToAdd, stringFileContentsJSON) {
    var _a;
    if ((_a = stringFileContentsJSON === null || stringFileContentsJSON === void 0 ? void 0 : stringFileContentsJSON.resources) === null || _a === void 0 ? void 0 : _a.string) {
        const stringNameExists = stringFileContentsJSON.resources.string.filter((e) => e.$.name === itemToAdd[0].$.name)[0];
        if (stringNameExists) {
            // replace the previous value
            stringNameExists._ = itemToAdd[0]._;
        }
        else {
            stringFileContentsJSON.resources.string = stringFileContentsJSON.resources.string.concat(itemToAdd);
        }
    }
    else {
        if (!stringFileContentsJSON.resources || typeof stringFileContentsJSON.resources === 'string') {
            // file was empty and JSON is `{resources : ''}`
            stringFileContentsJSON.resources = {};
        }
        stringFileContentsJSON.resources.string = itemToAdd;
    }
    return stringFileContentsJSON;
}
exports.setStringItem = setStringItem;
function removeStringItem(named, stringFileContentsJSON) {
    var _a;
    if ((_a = stringFileContentsJSON === null || stringFileContentsJSON === void 0 ? void 0 : stringFileContentsJSON.resources) === null || _a === void 0 ? void 0 : _a.string) {
        const stringNameExists = stringFileContentsJSON.resources.string.findIndex((e) => e.$.name === named);
        if (stringNameExists > -1) {
            // replace the previous value
            stringFileContentsJSON.resources.string.splice(stringNameExists, 1);
        }
    }
    return stringFileContentsJSON;
}
exports.removeStringItem = removeStringItem;
//# sourceMappingURL=Strings.js.map