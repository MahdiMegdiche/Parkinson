"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_utils_1 = require("@expo/image-utils");
const fs = __importStar(require("fs-extra"));
const path_1 = require("path");
const core_plugins_1 = require("../plugins/core-plugins");
const WarningAggregator = __importStar(require("../utils/warnings"));
const AssetContents_1 = require("./AssetContents");
const Xcodeproj_1 = require("./utils/Xcodeproj");
exports.withIcons = config => {
    return core_plugins_1.withDangerousMod(config, [
        'ios',
        async (config) => {
            await setIconsAsync(config, config.modRequest.projectRoot);
            return config;
        },
    ]);
};
const IMAGE_CACHE_NAME = 'icons';
const IMAGESET_PATH = 'Images.xcassets/AppIcon.appiconset';
// Hard-coding seemed like the clearest and safest way to implement the sizes.
exports.ICON_CONTENTS = [
    {
        idiom: 'iphone',
        sizes: [
            {
                size: 20,
                scales: [2, 3],
            },
            {
                size: 29,
                scales: [1, 2, 3],
            },
            {
                size: 40,
                scales: [2, 3],
            },
            {
                size: 60,
                scales: [2, 3],
            },
        ],
    },
    {
        idiom: 'ipad',
        sizes: [
            {
                size: 20,
                scales: [1, 2],
            },
            {
                size: 29,
                scales: [1, 2],
            },
            {
                size: 40,
                scales: [1, 2],
            },
            {
                size: 76,
                scales: [1, 2],
            },
            {
                size: 83.5,
                scales: [2],
            },
        ],
    },
    {
        idiom: 'ios-marketing',
        sizes: [
            {
                size: 1024,
                scales: [1],
            },
        ],
    },
];
function getIcons(config) {
    var _a;
    // No support for empty strings.
    return ((_a = config.ios) === null || _a === void 0 ? void 0 : _a.icon) || config.icon || null;
}
exports.getIcons = getIcons;
async function setIconsAsync(config, projectRoot) {
    const icon = getIcons(config);
    if (!icon) {
        WarningAggregator.addWarningIOS('icon', 'This is the image that your app uses on your home screen, you will need to configure it manually.');
        return;
    }
    // Something like projectRoot/ios/MyApp/
    const iosNamedProjectRoot = getIosNamedProjectPath(projectRoot);
    // Ensure the Images.xcassets/AppIcon.appiconset path exists
    await fs.ensureDir(path_1.join(iosNamedProjectRoot, IMAGESET_PATH));
    // Store the image JSON data for assigning via the Contents.json
    const imagesJson = [];
    // keep track of icons that have been generated so we can reuse them in the Contents.json
    const generatedIcons = {};
    for (const platform of exports.ICON_CONTENTS) {
        const isMarketing = platform.idiom === 'ios-marketing';
        for (const { size, scales } of platform.sizes) {
            for (const scale of scales) {
                // The marketing icon is special because it makes no sense.
                const filename = isMarketing ? 'ItunesArtwork@2x.png' : getAppleIconName(size, scale);
                // Only create an image that hasn't already been generated.
                if (!(filename in generatedIcons)) {
                    const iconSizePx = size * scale;
                    // Using this method will cache the images in `.expo` based on the properties used to generate them.
                    // this method also supports remote URLs and using the global sharp instance.
                    const { source } = await image_utils_1.generateImageAsync({ projectRoot, cacheType: IMAGE_CACHE_NAME }, {
                        src: icon,
                        name: filename,
                        width: iconSizePx,
                        height: iconSizePx,
                        removeTransparency: true,
                        // The icon should be square, but if it's not then it will be cropped.
                        resizeMode: 'cover',
                        // Force the background color to solid white to prevent any transparency.
                        // TODO: Maybe use a more adaptive option based on the icon color?
                        backgroundColor: '#ffffff',
                    });
                    // Write image buffer to the file system.
                    const assetPath = path_1.join(iosNamedProjectRoot, IMAGESET_PATH, filename);
                    await fs.writeFile(assetPath, source);
                    // Save a reference to the generated image so we don't create a duplicate.
                    generatedIcons[filename] = true;
                }
                imagesJson.push({
                    idiom: platform.idiom,
                    size: `${size}x${size}`,
                    // @ts-ignore: template types not supported in TS yet
                    scale: `${scale}x`,
                    filename,
                });
            }
        }
    }
    // Finally, write the Config.json
    await AssetContents_1.writeContentsJsonAsync(path_1.join(iosNamedProjectRoot, IMAGESET_PATH), { images: imagesJson });
}
exports.setIconsAsync = setIconsAsync;
/**
 * Return the project's named iOS path: ios/MyProject/
 *
 * @param projectRoot Expo project root path.
 */
function getIosNamedProjectPath(projectRoot) {
    const projectName = Xcodeproj_1.getProjectName(projectRoot);
    return path_1.join(projectRoot, 'ios', projectName);
}
function getAppleIconName(size, scale) {
    return `App-Icon-${size}x${size}@${scale}x.png`;
}
//# sourceMappingURL=Icons.js.map