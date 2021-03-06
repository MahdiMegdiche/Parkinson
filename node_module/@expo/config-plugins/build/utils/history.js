"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getHistoryItem(config, name) {
    var _a, _b, _c;
    return (_c = (_b = (_a = config._internal) === null || _a === void 0 ? void 0 : _a.pluginHistory) === null || _b === void 0 ? void 0 : _b[name]) !== null && _c !== void 0 ? _c : null;
}
exports.getHistoryItem = getHistoryItem;
function addHistoryItem(config, item) {
    if (!config._internal) {
        config._internal = {};
    }
    if (!config._internal.pluginHistory) {
        config._internal.pluginHistory = {};
    }
    if (!item.version) {
        item.version = 'UNVERSIONED';
    }
    config._internal.pluginHistory[item.name] = item;
    return config;
}
exports.addHistoryItem = addHistoryItem;
//# sourceMappingURL=history.js.map