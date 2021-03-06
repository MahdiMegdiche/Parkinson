/*!
 * @pixi/filter-color-replace - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-color-replace is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n";

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-replace.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
 *
 */
var ColorReplaceFilter = /** @class */ (function (_super) {
    __extends(ColorReplaceFilter, _super);
    /**
     * @param {number|Array<number>|Float32Array} [originalColor=0xFF0000] - The color that will be changed,
     *        as a 3 component RGB e.g. `[1.0, 1.0, 1.0]`
     * @param {number|Array<number>|Float32Array} [newColor=0x000000] - The resulting color, as a 3 component
     *        RGB e.g. `[1.0, 0.5, 1.0]`
     * @param {number} [epsilon=0.4] - Tolerance/sensitivity of the floating-point comparison between colors
     *        (lower = more exact, higher = more inclusive)
     */
    function ColorReplaceFilter(originalColor, newColor, epsilon) {
        if (originalColor === void 0) { originalColor = 0xFF0000; }
        if (newColor === void 0) { newColor = 0x000000; }
        if (epsilon === void 0) { epsilon = 0.4; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this._originalColor = 0xff0000;
        _this._newColor = 0x0;
        _this.uniforms.originalColor = new Float32Array(3);
        _this.uniforms.newColor = new Float32Array(3);
        _this.originalColor = originalColor;
        _this.newColor = newColor;
        _this.epsilon = epsilon;
        return _this;
    }
    Object.defineProperty(ColorReplaceFilter.prototype, "originalColor", {
        get: function () {
            return this._originalColor;
        },
        /**
         * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
         * @member {number|Array<number>|Float32Array}
         * @default 0xFF0000
         */
        set: function (value) {
            var arr = this.uniforms.originalColor;
            if (typeof value === 'number') {
                hex2rgb(value, arr);
                this._originalColor = value;
            }
            else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                this._originalColor = rgb2hex(arr);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorReplaceFilter.prototype, "newColor", {
        get: function () {
            return this._newColor;
        },
        /**
         * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
         * @member {number|Array<number>|Float32Array}
         * @default 0x000000
         */
        set: function (value) {
            var arr = this.uniforms.newColor;
            if (typeof value === 'number') {
                hex2rgb(value, arr);
                this._newColor = value;
            }
            else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                this._newColor = rgb2hex(arr);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorReplaceFilter.prototype, "epsilon", {
        get: function () {
            return this.uniforms.epsilon;
        },
        /**
         * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
         * @member {number}
         * @default 0.4
         */
        set: function (value) {
            this.uniforms.epsilon = value;
        },
        enumerable: false,
        configurable: true
    });
    return ColorReplaceFilter;
}(Filter));

export { ColorReplaceFilter };
//# sourceMappingURL=filter-color-replace.esm.js.map
