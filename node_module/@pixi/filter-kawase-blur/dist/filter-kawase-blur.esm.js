/*!
 * @pixi/filter-kawase-blur - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-kawase-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { Point } from '@pixi/math';

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

var fragment = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}";

var fragmentClamp = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n";

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-kawase-blur|@pixi/filter-kawase-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var KawaseBlurFilter = /** @class */ (function (_super) {
    __extends(KawaseBlurFilter, _super);
    /**
     * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
     *        value is an Array, setting kernels.
     * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
     * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
     *        from fullscreen filters or bleeding to the edge of filterArea.
     */
    function KawaseBlurFilter(blur, quality, clamp) {
        if (blur === void 0) { blur = 4; }
        if (quality === void 0) { quality = 3; }
        if (clamp === void 0) { clamp = false; }
        var _this = _super.call(this, vertex, clamp ? fragmentClamp : fragment) || this;
        _this._kernels = [];
        _this._blur = 4;
        _this._quality = 3;
        _this.uniforms.uOffset = new Float32Array(2);
        _this._pixelSize = new Point();
        _this.pixelSize = 1;
        _this._clamp = clamp;
        // if `blur` is array , as kernels
        if (Array.isArray(blur)) {
            _this.kernels = blur;
        }
        else {
            _this._blur = blur;
            _this.quality = quality;
        }
        return _this;
    }
    /**
     * Overrides apply
     * @private
     */
    KawaseBlurFilter.prototype.apply = function (filterManager, input, output, clear) {
        var uvX = this._pixelSize.x / input._frame.width;
        var uvY = this._pixelSize.y / input._frame.height;
        var offset;
        if (this._quality === 1 || this._blur === 0) {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            var renderTarget = filterManager.getFilterTexture();
            var source = input;
            var target = renderTarget;
            var tmp = void 0;
            var last = this._quality - 1;
            for (var i = 0; i < last; i++) {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, 1);
                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);
            filterManager.returnFilterTexture(renderTarget);
        }
    };
    KawaseBlurFilter.prototype._updatePadding = function () {
        this.padding = Math.ceil(this._kernels.reduce(function (acc, v) { return acc + v + 0.5; }, 0));
    };
    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    KawaseBlurFilter.prototype._generateKernels = function () {
        var blur = this._blur;
        var quality = this._quality;
        var kernels = [blur];
        if (blur > 0) {
            var k = blur;
            var step = blur / quality;
            for (var i = 1; i < quality; i++) {
                k -= step;
                kernels.push(k);
            }
        }
        this._kernels = kernels;
        this._updatePadding();
    };
    Object.defineProperty(KawaseBlurFilter.prototype, "kernels", {
        /**
         * The kernel size of the blur filter, for advanced usage.
         *
         * @member {number[]}
         * @default [0]
         */
        get: function () {
            return this._kernels;
        },
        set: function (value) {
            if (Array.isArray(value) && value.length > 0) {
                this._kernels = value;
                this._quality = value.length;
                this._blur = Math.max.apply(Math, value);
            }
            else {
                // if value is invalid , set default value
                this._kernels = [0];
                this._quality = 1;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KawaseBlurFilter.prototype, "clamp", {
        /**
         * Get the if the filter is clampped.
         *
         * @readonly
         * @member {boolean}
         * @default false
         */
        get: function () {
            return this._clamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KawaseBlurFilter.prototype, "pixelSize", {
        get: function () {
            return this._pixelSize;
        },
        /**
         * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
         *
         * @member {PIXI.Point|number[]}
         * @default [1, 1]
         */
        set: function (value) {
            if (typeof value === 'number') {
                this._pixelSize.x = value;
                this._pixelSize.y = value;
            }
            else if (Array.isArray(value)) {
                this._pixelSize.x = value[0];
                this._pixelSize.y = value[1];
            }
            else if (value instanceof Point) {
                this._pixelSize.x = value.x;
                this._pixelSize.y = value.y;
            }
            else {
                // if value is invalid , set default value
                this._pixelSize.x = 1;
                this._pixelSize.y = 1;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KawaseBlurFilter.prototype, "quality", {
        /**
         * The quality of the filter, integer greater than `1`.
         *
         * @member {number}
         * @default 3
         */
        get: function () {
            return this._quality;
        },
        set: function (value) {
            this._quality = Math.max(1, Math.round(value));
            this._generateKernels();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KawaseBlurFilter.prototype, "blur", {
        /**
         * The amount of blur, value greater than `0`.
         *
         * @member {number}
         * @default 4
         */
        get: function () {
            return this._blur;
        },
        set: function (value) {
            this._blur = value;
            this._generateKernels();
        },
        enumerable: false,
        configurable: true
    });
    return KawaseBlurFilter;
}(Filter));

export { KawaseBlurFilter };
//# sourceMappingURL=filter-kawase-blur.esm.js.map
