/*!
 * @pixi/filter-rgb-split - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@pixi/core');

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

var fragment = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-rgb-split|@pixi/filter-rgb-split}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var RGBSplitFilter = /** @class */ (function (_super) {
    __extends(RGBSplitFilter, _super);
    /**
     * @param {PIXI.Point | number[]} [red=[-10,0]] - Red channel offset
     * @param {PIXI.Point | number[]} [green=[0, 10]] - Green channel offset
     * @param {PIXI.Point | number[]} [blue=[0, 0]] - Blue channel offset
     */
    function RGBSplitFilter(red, green, blue) {
        if (red === void 0) { red = [-10, 0]; }
        if (green === void 0) { green = [0, 10]; }
        if (blue === void 0) { blue = [0, 0]; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.red = red;
        _this.green = green;
        _this.blue = blue;
        return _this;
    }
    Object.defineProperty(RGBSplitFilter.prototype, "red", {
        /**
         * Red channel offset.
         *
         * @member {PIXI.Point | number[]}
         */
        get: function () {
            return this.uniforms.red;
        },
        set: function (value) {
            this.uniforms.red = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBSplitFilter.prototype, "green", {
        /**
         * Green channel offset.
         *
         * @member {PIXI.Point | number[]}
         */
        get: function () {
            return this.uniforms.green;
        },
        set: function (value) {
            this.uniforms.green = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBSplitFilter.prototype, "blue", {
        /**
         * Blue offset.
         *
         * @member {PIXI.Point | number[]}
         */
        get: function () {
            return this.uniforms.blue;
        },
        set: function (value) {
            this.uniforms.blue = value;
        },
        enumerable: false,
        configurable: true
    });
    return RGBSplitFilter;
}(core.Filter));

exports.RGBSplitFilter = RGBSplitFilter;
//# sourceMappingURL=filter-rgb-split.cjs.js.map
