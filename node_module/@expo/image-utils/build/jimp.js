"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const es_1 = __importDefault(require("jimp/es"));
const path = __importStar(require("path"));
async function resizeBufferAsync(buffer, sizes) {
    return Promise.all(sizes.map(async (size) => {
        // Parse the buffer each time to prevent mutable copies.
        // Parse the buffer each time to prevent mutable copies.
        const jimpImage = await es_1.default.read(buffer);
        const mime = jimpImage.getMIME();
        return jimpImage.resize(size, size).getBufferAsync(mime);
    }));
}
exports.resizeBufferAsync = resizeBufferAsync;
function convertFormat(format) {
    if (typeof format === 'undefined')
        return format;
    const input = format === null || format === void 0 ? void 0 : format.toLowerCase();
    switch (input) {
        case 'png':
        case 'webp':
        case 'jpeg':
            return `image/${input}`;
        case 'jpg':
            return `image/jpeg`;
    }
    return undefined;
}
exports.convertFormat = convertFormat;
async function jimpAsync(options, commands = []) {
    if (commands.length) {
        const command = commands.shift();
        if (command) {
            let input;
            if (command.operation === 'resize') {
                input = await resize(options, command);
            }
            else if (command.operation === 'flatten') {
                input = await flatten(options, command);
            }
            else {
                throw new Error(`The operation: '${command.operation}' is not supported with Jimp`);
            }
            // @ts-ignore
            return jimpAsync(Object.assign(Object.assign({}, options), { input }), commands);
        }
    }
    const image = await getJimpImageAsync(options.input);
    const mime = typeof options.format === 'string' ? options.format : image.getMIME();
    const imgBuffer = await image.getBufferAsync(mime);
    if (typeof options.output === 'string') {
        if (await isFolderAsync(options.output)) {
            await fs_extra_1.default.writeFile(path.join(options.output, path.basename(options.originalInput)), imgBuffer);
        }
        else {
            await fs_extra_1.default.writeFile(options.output, imgBuffer);
        }
    }
    return imgBuffer;
}
exports.jimpAsync = jimpAsync;
async function isFolderAsync(path) {
    try {
        return (await fs_extra_1.default.stat(path)).isDirectory();
    }
    catch (e) {
        return false;
    }
}
exports.isFolderAsync = isFolderAsync;
function circleAsync(jimp) {
    const radius = Math.min(jimp.bitmap.width, jimp.bitmap.height) / 2;
    const center = {
        x: jimp.bitmap.width / 2,
        y: jimp.bitmap.height / 2,
    };
    return new Promise(resolve => {
        jimp.scanQuiet(0, 0, jimp.bitmap.width, jimp.bitmap.height, (x, y, idx) => {
            const curR = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
            if (radius - curR <= 0.0) {
                jimp.bitmap.data[idx + 3] = 0;
            }
            else if (radius - curR < 1.0) {
                jimp.bitmap.data[idx + 3] = 255 * (radius - curR);
            }
            resolve(jimp);
        });
    });
}
exports.circleAsync = circleAsync;
async function getJimpImageAsync(input) {
    // @ts-ignore: Jimp types are broken
    if (typeof input === 'string' || input instanceof Buffer)
        return await es_1.default.read(input);
    return input;
}
exports.getJimpImageAsync = getJimpImageAsync;
async function resize({ input, quality = 100 }, { background, position, fit, width, height = es_1.default.AUTO }) {
    let initialImage = await getJimpImageAsync(input);
    const jimpPosition = convertPosition(position);
    const jimpQuality = typeof quality !== 'number' ? 100 : quality;
    if (fit === 'cover') {
        initialImage = initialImage.cover(width, height, jimpPosition);
    }
    else if (fit === 'contain') {
        initialImage = initialImage.contain(width, height, jimpPosition);
    }
    else {
        throw new Error(`Unsupported fit: ${fit}. Please choose either 'cover', or 'contain' when using Jimp`);
    }
    if (background) {
        initialImage = initialImage.composite(new es_1.default(width, height, background), 0, 0, {
            mode: es_1.default.BLEND_DESTINATION_OVER,
            opacitySource: 1,
            opacityDest: 1,
        });
    }
    return await initialImage.quality(jimpQuality);
}
exports.resize = resize;
async function flatten({ input, quality = 100 }, { background }) {
    const initialImage = await getJimpImageAsync(input);
    const jimpQuality = typeof quality !== 'number' ? 100 : quality;
    return initialImage.quality(jimpQuality).background(es_1.default.cssColorToHex(background));
}
/**
 * Convert sharp position to Jimp position.
 *
 * @param position
 */
function convertPosition(position) {
    if (!position)
        return convertPosition('center');
    switch (position) {
        case 'center':
        case 'centre':
            return es_1.default.VERTICAL_ALIGN_MIDDLE | es_1.default.HORIZONTAL_ALIGN_CENTER;
        case 'north':
        case 'top':
            return es_1.default.VERTICAL_ALIGN_TOP | es_1.default.HORIZONTAL_ALIGN_CENTER;
        case 'east':
        case 'right':
            return es_1.default.VERTICAL_ALIGN_MIDDLE | es_1.default.HORIZONTAL_ALIGN_RIGHT;
        case 'south':
        case 'bottom':
            return es_1.default.VERTICAL_ALIGN_BOTTOM | es_1.default.HORIZONTAL_ALIGN_CENTER;
        case 'west':
        case 'left':
            return es_1.default.VERTICAL_ALIGN_MIDDLE | es_1.default.HORIZONTAL_ALIGN_LEFT;
        case 'northeast':
        case 'right top':
            return es_1.default.VERTICAL_ALIGN_TOP | es_1.default.HORIZONTAL_ALIGN_RIGHT;
        case 'southeast':
        case 'right bottom':
            return es_1.default.VERTICAL_ALIGN_BOTTOM | es_1.default.HORIZONTAL_ALIGN_RIGHT;
        case 'southwest':
        case 'left bottom':
            return es_1.default.VERTICAL_ALIGN_BOTTOM | es_1.default.HORIZONTAL_ALIGN_LEFT;
        case 'northwest':
        case 'left top':
            return es_1.default.VERTICAL_ALIGN_TOP | es_1.default.HORIZONTAL_ALIGN_LEFT;
        case 'entropy':
        case 'attention':
            throw new Error(`Position: '${position}' is not supported`);
        default:
            throw new Error(`Unknown position: '${position}'`);
    }
}
//# sourceMappingURL=jimp.js.map