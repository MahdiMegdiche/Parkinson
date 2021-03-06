"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Paths_1 = require("./Paths");
const Resources_1 = require("./Resources");
async function getProjectStylesXMLPathAsync(projectRoot, { kind } = {}) {
    return Paths_1.getResourceXMLPathAsync(projectRoot, { kind, name: 'styles' });
}
exports.getProjectStylesXMLPathAsync = getProjectStylesXMLPathAsync;
function ensureDefaultStyleResourceXML(xml) {
    var _a;
    xml = Resources_1.ensureDefaultResourceXML(xml);
    if (!Array.isArray((_a = xml === null || xml === void 0 ? void 0 : xml.resources) === null || _a === void 0 ? void 0 : _a.style)) {
        xml.resources.style = [];
    }
    return xml;
}
function getStyleParent(xml, parent) {
    var _a, _b, _c, _d;
    const app = (_d = (_c = (_b = (_a = xml === null || xml === void 0 ? void 0 : xml.resources) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.filter) === null || _c === void 0 ? void 0 : _c.call(_b, (e) => {
        let matches = e.$.name === parent.name;
        if (parent.parent != null && matches) {
            matches = e.$.parent === parent.parent;
        }
        return matches;
    })) === null || _d === void 0 ? void 0 : _d[0];
    return app !== null && app !== void 0 ? app : null;
}
exports.getStyleParent = getStyleParent;
function getStylesItem({ name, xml, parent, }) {
    xml = ensureDefaultStyleResourceXML(xml);
    const appTheme = getStyleParent(xml, parent);
    if (!appTheme) {
        return null;
    }
    if (appTheme.item) {
        const existingItem = appTheme.item.filter(_item => _item.$.name === name)[0];
        // Don't want to 2 of the same item, so if one exists, we overwrite it
        if (existingItem) {
            return existingItem;
        }
    }
    return null;
}
exports.getStylesItem = getStylesItem;
function setStylesItem({ item, xml, parent, }) {
    xml = ensureDefaultStyleResourceXML(xml);
    let appTheme = getStyleParent(xml, parent);
    if (!appTheme) {
        appTheme = Resources_1.buildResourceGroup(parent);
        xml.resources.style.push(appTheme);
    }
    if (appTheme.item) {
        const existingItem = appTheme.item.filter(_item => _item.$.name === item.$.name)[0];
        // Don't want to 2 of the same item, so if one exists, we overwrite it
        if (existingItem) {
            existingItem._ = item._;
        }
        else {
            appTheme.item.push(item);
        }
    }
    else {
        appTheme.item = [item];
    }
    return xml;
}
exports.setStylesItem = setStylesItem;
function removeStylesItem({ name, xml, parent, }) {
    xml = ensureDefaultStyleResourceXML(xml);
    const appTheme = getStyleParent(xml, parent);
    if (appTheme === null || appTheme === void 0 ? void 0 : appTheme.item) {
        const index = appTheme.item.findIndex((e) => e.$.name === name);
        if (index > -1) {
            appTheme.item.splice(index, 1);
        }
    }
    return xml;
}
exports.removeStylesItem = removeStylesItem;
//# sourceMappingURL=Styles.js.map