/*!
 * @pixi/filter-color-map - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-color-map is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@pixi/core');
var constants = require('@pixi/constants');

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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D colorMap;\nuniform float _mix;\nuniform float _size;\nuniform float _sliceSize;\nuniform float _slicePixelSize;\nuniform float _sliceInnerSize;\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\n\n    vec4 adjusted;\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n        float innerWidth = _size - 1.0;\n        float zSlice0 = min(floor(color.b * innerWidth), innerWidth);\n        float zSlice1 = min(zSlice0 + 1.0, innerWidth);\n        float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\n        float s0 = xOffset + (zSlice0 * _sliceSize);\n        float s1 = xOffset + (zSlice1 * _sliceSize);\n        float yOffset = _sliceSize * 0.5 + color.g * (1.0 - _sliceSize);\n        vec4 slice0Color = texture2D(colorMap, vec2(s0,yOffset));\n        vec4 slice1Color = texture2D(colorMap, vec2(s1,yOffset));\n        float zOffset = fract(color.b * innerWidth);\n        adjusted = mix(slice0Color, slice1Color, zOffset);\n\n        color.rgb *= color.a;\n    }\n    gl_FragColor = vec4(mix(color, adjusted, _mix).rgb, color.a);\n\n}";

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-map.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-map|@pixi/filter-color-map}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var ColorMapFilter = /** @class */ (function (_super) {
    __extends(ColorMapFilter, _super);
    /**
     * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The
     *        colorMap texture of the filter.
     * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
     * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     */
    function ColorMapFilter(colorMap, nearest, mix) {
        if (nearest === void 0) { nearest = false; }
        if (mix === void 0) { mix = 1; }
        var _this = _super.call(this, vertex, fragment) || this;
        /** The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image. */
        _this.mix = 1;
        _this._size = 0;
        _this._sliceSize = 0;
        _this._slicePixelSize = 0;
        _this._sliceInnerSize = 0;
        _this._nearest = false;
        _this._scaleMode = null;
        _this._colorMap = null;
        _this._scaleMode = null;
        _this.nearest = nearest;
        _this.mix = mix;
        _this.colorMap = colorMap;
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    ColorMapFilter.prototype.apply = function (filterManager, input, output, clear) {
        this.uniforms._mix = this.mix;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(ColorMapFilter.prototype, "colorSize", {
        /**
         * the size of one color slice
         * @member {number}
         * @readonly
         */
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorMapFilter.prototype, "colorMap", {
        /**
         * the colorMap texture
         * @member {PIXI.Texture}
         */
        get: function () {
            return this._colorMap;
        },
        set: function (colorMap) {
            var _a;
            if (!colorMap) {
                return;
            }
            if (!(colorMap instanceof core.Texture)) {
                colorMap = core.Texture.from(colorMap);
            }
            if ((_a = colorMap) === null || _a === void 0 ? void 0 : _a.baseTexture) {
                colorMap.baseTexture.scaleMode = this._scaleMode;
                colorMap.baseTexture.mipmap = constants.MIPMAP_MODES.OFF;
                this._size = colorMap.height;
                this._sliceSize = 1 / this._size;
                this._slicePixelSize = this._sliceSize / this._size;
                this._sliceInnerSize = this._slicePixelSize * (this._size - 1);
                this.uniforms._size = this._size;
                this.uniforms._sliceSize = this._sliceSize;
                this.uniforms._slicePixelSize = this._slicePixelSize;
                this.uniforms._sliceInnerSize = this._sliceInnerSize;
                this.uniforms.colorMap = colorMap;
            }
            this._colorMap = colorMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorMapFilter.prototype, "nearest", {
        /**
         * Whether use NEAREST for colorMap texture.
         * @member {boolean}
         */
        get: function () {
            return this._nearest;
        },
        set: function (nearest) {
            this._nearest = nearest;
            this._scaleMode = nearest ? constants.SCALE_MODES.NEAREST : constants.SCALE_MODES.LINEAR;
            var texture = this._colorMap;
            if (texture && texture.baseTexture) {
                texture.baseTexture._glTextures = {};
                texture.baseTexture.scaleMode = this._scaleMode;
                texture.baseTexture.mipmap = constants.MIPMAP_MODES.OFF;
                texture._updateID++;
                texture.baseTexture.emit('update', texture.baseTexture);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * If the colorMap is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    ColorMapFilter.prototype.updateColorMap = function () {
        var texture = this._colorMap;
        if (texture && texture.baseTexture) {
            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);
            this.colorMap = texture;
        }
    };
    /**
     * Destroys this filter
     *
     * @param {boolean} [destroyBase=false] - Whether to destroy the base texture of colorMap as well
     */
    ColorMapFilter.prototype.destroy = function (destroyBase) {
        if (destroyBase === void 0) { destroyBase = false; }
        if (this._colorMap) {
            this._colorMap.destroy(destroyBase);
        }
        _super.prototype.destroy.call(this);
    };
    return ColorMapFilter;
}(core.Filter));

exports.ColorMapFilter = ColorMapFilter;
//# sourceMappingURL=filter-color-map.cjs.js.map
