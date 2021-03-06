"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XML_1 = require("../utils/XML");
const fallbackResourceString = `<?xml version="1.0" encoding="utf-8"?><resources></resources>`;
/**
 * Read an XML file while providing a default fallback for resource files.
 *
 * @param options path to the XML file, returns a fallback XML if the path doesn't exist.
 */
async function readResourcesXMLAsync({ path, fallback = fallbackResourceString, }) {
    const xml = await XML_1.readXMLAsync({ path, fallback });
    // Ensure the type is expected.
    if (!xml.resources) {
        xml.resources = {};
    }
    return xml;
}
exports.readResourcesXMLAsync = readResourcesXMLAsync;
/**
 * Ensure the provided xml has a `resources` object (the expected shape).
 *
 * @param xml
 */
function ensureDefaultResourceXML(xml) {
    if (!xml) {
        xml = { resources: {} };
    }
    if (!xml.resources) {
        xml.resources = {};
    }
    return xml;
}
exports.ensureDefaultResourceXML = ensureDefaultResourceXML;
/**
 * Build a `ResourceItemXML` given its `name` and `value`. This makes things a bit more readable.
 *
 * - JSON: `{ $: { name }, _: value }`
 * - XML: `<item name="NAME">VALUE</item>`
 *
 * @param props name and value strings.
 */
function buildResourceItem({ name, value, }) {
    return { $: { name }, _: value };
}
exports.buildResourceItem = buildResourceItem;
function buildResourceGroup(parent) {
    var _a;
    return {
        $: { name: parent.name, parent: parent.parent },
        item: (_a = parent.items) !== null && _a !== void 0 ? _a : [],
    };
}
exports.buildResourceGroup = buildResourceGroup;
//# sourceMappingURL=Resources.js.map