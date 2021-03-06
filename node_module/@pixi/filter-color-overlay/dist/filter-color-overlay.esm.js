/*!
 * @pixi/filter-color-overlay - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-color-overlay is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nuniform float alpha;\n\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4(mix(currentColor.rgb, color.rgb, currentColor.a * alpha), currentColor.a);\n}\n";

/**
 * Replace all colors within a source graphic with a single color.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-overlay.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces red with blue
 *  someSprite.filters = [new ColorOverlayFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *
 */
var ColorOverlayFilter = /** @class */ (function (_super) {
    __extends(ColorOverlayFilter, _super);
    /**
     * @param {number|Array<number>} [color=0x000000] - The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @param {number} [alpha=1] - The alpha value of the color
     */
    function ColorOverlayFilter(color, alpha) {
        if (color === void 0) { color = 0x000000; }
        if (alpha === void 0) { alpha = 1; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this._color = 0x0;
        _this._alpha = 1;
        _this.uniforms.color = new Float32Array(3);
        _this.color = color;
        _this.alpha = alpha;
        return _this;
    }
    Object.defineProperty(ColorOverlayFilter.prototype, "color", {
        get: function () {
            return this._color;
        },
        /**
         * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
         * @member {number|Array<number>|Float32Array}
         * @default 0x000000
         */
        set: function (value) {
            var arr = this.uniforms.color;
            if (typeof value === 'number') {
                hex2rgb(value, arr);
                this._color = value;
            }
            else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                this._color = rgb2hex(arr);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorOverlayFilter.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        /**
         * The alpha value of the color
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.alpha = value;
            this._alpha = value;
        },
        enumerable: false,
        configurable: true
    });
    return ColorOverlayFilter;
}(Filter));

export { ColorOverlayFilter };
//# sourceMappingURL=filter-color-overlay.esm.js.map
