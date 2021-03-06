"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Paths_1 = require("./Paths");
function getProjectColorsXMLPathAsync(projectRoot, { kind } = {}) {
    return Paths_1.getResourceXMLPathAsync(projectRoot, { kind, name: 'colors' });
}
exports.getProjectColorsXMLPathAsync = getProjectColorsXMLPathAsync;
function setColorItem(itemToAdd, colorFileContentsJSON) {
    var _a;
    if ((_a = colorFileContentsJSON.resources) === null || _a === void 0 ? void 0 : _a.color) {
        const colorNameExists = colorFileContentsJSON.resources.color.filter((e) => e.$.name === itemToAdd.$.name)[0];
        if (colorNameExists) {
            colorNameExists._ = itemToAdd._;
        }
        else {
            colorFileContentsJSON.resources.color.push(itemToAdd);
        }
    }
    else {
        if (!colorFileContentsJSON.resources || typeof colorFileContentsJSON.resources === 'string') {
            //file was empty and JSON is `{resources : ''}`
            colorFileContentsJSON.resources = {};
        }
        colorFileContentsJSON.resources.color = [itemToAdd];
    }
    return colorFileContentsJSON;
}
exports.setColorItem = setColorItem;
function removeColorItem(named, contents) {
    var _a;
    if ((_a = contents.resources) === null || _a === void 0 ? void 0 : _a.color) {
        const index = contents.resources.color.findIndex((e) => e.$.name === named);
        if (index > -1) {
            // replace the previous value
            contents.resources.color.splice(index, 1);
        }
    }
    return contents;
}
exports.removeColorItem = removeColorItem;
//# sourceMappingURL=Colors.js.map