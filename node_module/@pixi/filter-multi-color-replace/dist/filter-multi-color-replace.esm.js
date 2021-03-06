/*!
 * @pixi/filter-multi-color-replace - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-multi-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { hex2rgb, rgb2hex } from '@pixi/utils';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) { if (Object.prototype.hasOwnProperty.call(b, p)) { d[p] = b[p]; } } };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n";

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-multi-color-replace|@pixi/filter-multi-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    0.001
 *  )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    0.001
 *  )];
 *
 */
var MultiColorReplaceFilter = /** @class */ (function (_super) {
    __extends(MultiColorReplaceFilter, _super);
    /**
     * @param {Array<Array>} replacements - The collection of replacement items. Each item is color-pair
     *        (an array length is 2). In the pair, the first value is original color , the second value
     *        is target color.
     * @param {number} [epsilon=0.05] - Tolerance of the floating-point comparison between colors
     *        (lower = more exact, higher = more inclusive)
     * @param {number} [maxColors] - The maximum number of replacements filter is able to use. Because the
     *        fragment is only compiled once, this cannot be changed after construction.
     *        If omitted, the default value is the length of `replacements`.
     */
    function MultiColorReplaceFilter(replacements, epsilon, maxColors) {
        if (epsilon === void 0) { epsilon = 0.05; }
        if (maxColors === void 0) { maxColors = replacements.length; }
        var _this = _super.call(this, vertex, fragment.replace(/%maxColors%/g, (maxColors).toFixed(0))) || this;
        _this._replacements = [];
        _this._maxColors = 0;
        _this.epsilon = epsilon;
        _this._maxColors = maxColors;
        _this.uniforms.originalColors = new Float32Array(maxColors * 3);
        _this.uniforms.targetColors = new Float32Array(maxColors * 3);
        _this.replacements = replacements;
        return _this;
    }
    Object.defineProperty(MultiColorReplaceFilter.prototype, "replacements", {
        get: function () {
            return this._replacements;
        },
        /**
         * The source and target colors for replacement. See constructor for information on the format.
         *
         * @member {Array<Array>}
         */
        set: function (replacements) {
            var originals = this.uniforms.originalColors;
            var targets = this.uniforms.targetColors;
            var colorCount = replacements.length;
            if (colorCount > this._maxColors) {
                throw new Error("Length of replacements (" + colorCount + ") exceeds the maximum colors length (" + this._maxColors + ")");
            }
            // Fill with negative values
            originals[colorCount * 3] = -1;
            for (var i = 0; i < colorCount; i++) {
                var pair = replacements[i];
                // for original colors
                var color = pair[0];
                if (typeof color === 'number') {
                    color = hex2rgb(color);
                }
                else {
                    pair[0] = rgb2hex(color);
                }
                originals[i * 3] = color[0];
                originals[(i * 3) + 1] = color[1];
                originals[(i * 3) + 2] = color[2];
                // for target colors
                var targetColor = pair[1];
                if (typeof targetColor === 'number') {
                    targetColor = hex2rgb(targetColor);
                }
                else {
                    pair[1] = rgb2hex(targetColor);
                }
                targets[i * 3] = targetColor[0];
                targets[(i * 3) + 1] = targetColor[1];
                targets[(i * 3) + 2] = targetColor[2];
            }
            this._replacements = replacements;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Should be called after changing any of the contents of the replacements.
     * This is a convenience method for resetting the `replacements`.
     */
    MultiColorReplaceFilter.prototype.refresh = function () {
        this.replacements = this._replacements;
    };
    Object.defineProperty(MultiColorReplaceFilter.prototype, "maxColors", {
        /**
         * The maximum number of color replacements supported by this filter. Can be changed
         * _only_ during construction.
         *
         * @member {number}
         * @readonly
         */
        get: function () {
            return this._maxColors;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MultiColorReplaceFilter.prototype, "epsilon", {
        get: function () {
            return this.uniforms.epsilon;
        },
        /**
         * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
         *
         * @member {number}
         * @default 0.05
         */
        set: function (value) {
            this.uniforms.epsilon = value;
        },
        enumerable: false,
        configurable: true
    });
    return MultiColorReplaceFilter;
}(Filter));

export { MultiColorReplaceFilter };
//# sourceMappingURL=filter-multi-color-replace.esm.js.map
