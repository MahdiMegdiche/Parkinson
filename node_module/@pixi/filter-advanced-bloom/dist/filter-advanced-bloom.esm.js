/*!
 * @pixi/filter-advanced-bloom - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-advanced-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import { settings } from '@pixi/settings';

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

var fragment = "\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n";

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 */
var ExtractBrightnessFilter = /** @class */ (function (_super) {
    __extends(ExtractBrightnessFilter, _super);
    /**
     * @param {number} [threshold] - Defines how bright a color needs to be extracted.
     */
    function ExtractBrightnessFilter(threshold) {
        if (threshold === void 0) { threshold = 0.5; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.threshold = threshold;
        return _this;
    }
    Object.defineProperty(ExtractBrightnessFilter.prototype, "threshold", {
        /**
         * Defines how bright a color needs to be extracted.
         *
         * @member {number}
         * @default 0.5
         */
        get: function () {
            return this.uniforms.threshold;
        },
        set: function (value) {
            this.uniforms.threshold = value;
        },
        enumerable: false,
        configurable: true
    });
    return ExtractBrightnessFilter;
}(Filter));

var fragment$1 = "uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n";

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-advanced-bloom|@pixi/filter-advanced-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var AdvancedBloomFilter = /** @class */ (function (_super) {
    __extends(AdvancedBloomFilter, _super);
    /**
     * @param {object|number} [options] - The optional parameters of advanced bloom filter.
     *                        When options is a number , it will be `options.threshold`.
     * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
     * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is
     *        more intense brightness.
     * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness,
     *        higher value is blown-out.
     * @param {number} [options.blur=8] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=4] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    function AdvancedBloomFilter(options) {
        var _this = _super.call(this, vertex, fragment$1) || this;
        /** To adjust the strength of the bloom. Higher values is more intense brightness. */
        _this.bloomScale = 1;
        /** The brightness, lower value is more subtle brightness, higher value is blown-out. */
        _this.brightness = 1;
        _this._resolution = settings.FILTER_RESOLUTION;
        if (typeof options === 'number') {
            options = { threshold: options };
        }
        var opt = Object.assign(AdvancedBloomFilter.defaults, options);
        _this.bloomScale = opt.bloomScale;
        _this.brightness = opt.brightness;
        var kernels = opt.kernels, blur = opt.blur, quality = opt.quality, pixelSize = opt.pixelSize, resolution = opt.resolution;
        _this._extractFilter = new ExtractBrightnessFilter(opt.threshold);
        _this._extractFilter.resolution = resolution;
        _this._blurFilter = kernels
            ? new KawaseBlurFilter(kernels)
            : new KawaseBlurFilter(blur, quality);
        _this.pixelSize = pixelSize;
        _this.resolution = resolution;
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     *
     * @private
     */
    AdvancedBloomFilter.prototype.apply = function (filterManager, input, output, clear, currentState) {
        var brightTarget = filterManager.getFilterTexture();
        this._extractFilter.apply(filterManager, input, brightTarget, 1, currentState);
        var bloomTarget = filterManager.getFilterTexture();
        this._blurFilter.apply(filterManager, brightTarget, bloomTarget, 1);
        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = bloomTarget;
        filterManager.applyFilter(this, input, output, clear);
        filterManager.returnFilterTexture(bloomTarget);
        filterManager.returnFilterTexture(brightTarget);
    };
    Object.defineProperty(AdvancedBloomFilter.prototype, "resolution", {
        /**
         * The resolution of the filter.
         * @ignore
         */
        get: function () {
            return this._resolution;
        },
        set: function (value) {
            this._resolution = value;
            if (this._extractFilter) {
                this._extractFilter.resolution = value;
            }
            if (this._blurFilter) {
                this._blurFilter.resolution = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AdvancedBloomFilter.prototype, "threshold", {
        /**
         * Defines how bright a color needs to be to affect bloom.
         *
         * @member {number}
         * @default 0.5
         */
        get: function () {
            return this._extractFilter.threshold;
        },
        set: function (value) {
            this._extractFilter.threshold = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AdvancedBloomFilter.prototype, "kernels", {
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
    Object.defineProperty(AdvancedBloomFilter.prototype, "blur", {
        /**
         * Sets the strength of the Blur properties simultaneously
         *
         * @member {number}
         * @default 2
         */
        get: function () {
            return this._blurFilter.blur;
        },
        set: function (value) {
            this._blurFilter.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AdvancedBloomFilter.prototype, "quality", {
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
    Object.defineProperty(AdvancedBloomFilter.prototype, "pixelSize", {
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
    /** Default construction options. */
    AdvancedBloomFilter.defaults = {
        threshold: 0.5,
        bloomScale: 1.0,
        brightness: 1.0,
        kernels: null,
        blur: 8,
        quality: 4,
        pixelSize: 1,
        resolution: settings.FILTER_RESOLUTION,
    };
    return AdvancedBloomFilter;
}(Filter));

export { AdvancedBloomFilter };
//# sourceMappingURL=filter-advanced-bloom.esm.js.map
