/*!
 * @pixi/filter-drop-shadow - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-drop-shadow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var filterKawaseBlur = require('@pixi/filter-kawase-blur');
var core = require('@pixi/core');
var settings = require('@pixi/settings');
var math = require('@pixi/math');
var utils = require('@pixi/utils');

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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\n\nuniform vec2 shift;\nuniform vec4 inputSize;\n\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);\n\n    // Premultiply alpha\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}";

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-drop-shadow|@pixi/filter-drop-shadow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var DropShadowFilter = /** @class */ (function (_super) {
    __extends(DropShadowFilter, _super);
    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.rotation=45] - The angle of the shadow in degrees.
     * @param {number} [options.distance=5] - Distance of shadow
     * @param {number} [options.color=0x000000] - Color of the shadow
     * @param {number} [options.alpha=0.5] - Alpha of the shadow
     * @param {boolean} [options.shadowOnly=false] - Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    function DropShadowFilter(options) {
        var _this = _super.call(this) || this;
        /** Angle of the shadow in degrees. */
        _this.angle = 45;
        _this._distance = 5;
        _this._resolution = settings.settings.FILTER_RESOLUTION;
        var opt = Object.assign(DropShadowFilter.defaults, options);
        var kernels = opt.kernels, blur = opt.blur, quality = opt.quality, pixelSize = opt.pixelSize, resolution = opt.resolution;
        _this._tintFilter = new core.Filter(vertex, fragment);
        _this._tintFilter.uniforms.color = new Float32Array(4);
        _this._tintFilter.uniforms.shift = new math.Point();
        _this._tintFilter.resolution = resolution;
        _this._blurFilter = kernels
            ? new filterKawaseBlur.KawaseBlurFilter(kernels)
            : new filterKawaseBlur.KawaseBlurFilter(blur, quality);
        _this.pixelSize = pixelSize;
        _this.resolution = resolution;
        var shadowOnly = opt.shadowOnly, rotation = opt.rotation, distance = opt.distance, alpha = opt.alpha, color = opt.color;
        _this.shadowOnly = shadowOnly;
        _this.rotation = rotation;
        _this.distance = distance;
        _this.alpha = alpha;
        _this.color = color;
        _this._updatePadding();
        return _this;
    }
    DropShadowFilter.prototype.apply = function (filterManager, input, output, clear) {
        var target = filterManager.getFilterTexture();
        this._tintFilter.apply(filterManager, input, target, 1);
        this._blurFilter.apply(filterManager, target, output, clear);
        if (this.shadowOnly !== true) {
            filterManager.applyFilter(this, input, output, 0);
        }
        filterManager.returnFilterTexture(target);
    };
    /**
     * Recalculate the proper padding amount.
     * @private
     */
    DropShadowFilter.prototype._updatePadding = function () {
        this.padding = this.distance + (this.blur * 2);
    };
    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    DropShadowFilter.prototype._updateShift = function () {
        this._tintFilter.uniforms.shift.set(this.distance * Math.cos(this.angle), this.distance * Math.sin(this.angle));
    };
    Object.defineProperty(DropShadowFilter.prototype, "resolution", {
        /**
         * The resolution of the filter.
         *
         * @member {number}
         * @default PIXI.settings.FILTER_RESOLUTION
         */
        get: function () {
            return this._resolution;
        },
        set: function (value) {
            this._resolution = value;
            if (this._tintFilter) {
                this._tintFilter.resolution = value;
            }
            if (this._blurFilter) {
                this._blurFilter.resolution = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "distance", {
        /**
         * Distance offset of the shadow
         * @member {number}
         * @default 5
         */
        get: function () {
            return this._distance;
        },
        set: function (value) {
            this._distance = value;
            this._updatePadding();
            this._updateShift();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "rotation", {
        /**
         * The angle of the shadow in degrees
         * @member {number}
         * @default 2
         */
        get: function () {
            return this.angle / math.DEG_TO_RAD;
        },
        set: function (value) {
            this.angle = value * math.DEG_TO_RAD;
            this._updateShift();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "alpha", {
        /**
         * The alpha of the shadow
         * @member {number}
         * @default 1
         */
        get: function () {
            return this._tintFilter.uniforms.alpha;
        },
        set: function (value) {
            this._tintFilter.uniforms.alpha = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "color", {
        /**
         * The color of the shadow.
         * @member {number}
         * @default 0x000000
         */
        get: function () {
            return utils.rgb2hex(this._tintFilter.uniforms.color);
        },
        set: function (value) {
            utils.hex2rgb(value, this._tintFilter.uniforms.color);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "kernels", {
        /**
         * Sets the kernels of the Blur Filter
         *
         * @member {number[]}
         */
        get: function () {
            return this._blurFilter.kernels;
        },
        set: function (value) {
            this._blurFilter.kernels = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "blur", {
        /**
         * The blur of the shadow
         * @member {number}
         * @default 2
         */
        get: function () {
            return this._blurFilter.blur;
        },
        set: function (value) {
            this._blurFilter.blur = value;
            this._updatePadding();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "quality", {
        /**
         * Sets the quality of the Blur Filter
         *
         * @member {number}
         * @default 4
         */
        get: function () {
            return this._blurFilter.quality;
        },
        set: function (value) {
            this._blurFilter.quality = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DropShadowFilter.prototype, "pixelSize", {
        /**
         * Sets the pixelSize of the Kawase Blur filter
         *
         * @member {number|number[]|PIXI.Point}
         * @default 1
         */
        get: function () {
            return this._blurFilter.pixelSize;
        },
        set: function (value) {
            this._blurFilter.pixelSize = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options. */
    DropShadowFilter.defaults = {
        rotation: 45,
        distance: 5,
        color: 0x000000,
        alpha: 0.5,
        shadowOnly: false,
        kernels: null,
        blur: 2,
        quality: 3,
        pixelSize: 1,
        resolution: settings.settings.FILTER_RESOLUTION,
    };
    return DropShadowFilter;
}(core.Filter));

exports.DropShadowFilter = DropShadowFilter;
//# sourceMappingURL=filter-drop-shadow.cjs.js.map
