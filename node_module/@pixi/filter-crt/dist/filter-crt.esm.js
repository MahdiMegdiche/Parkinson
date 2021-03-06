/*!
 * @pixi/filter-crt - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-crt is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';

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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 dir = vec2(vTextureCoord.xy - vec2(0.5, 0.5)) * filterArea.xy / dimensions;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0)\n    {\n        float _c = curvature > 0. ? curvature : 1.;\n        float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n        vec2 uv = dir * k;\n\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n";

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-crt|@pixi/filter-crt}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var CRTFilter = /** @class */ (function (_super) {
    __extends(CRTFilter, _super);
    /**
     * @param {object} [options] - The optional parameters of CRT effect
     * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
     * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
     * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
     * @param {number} [options.verticalLine=false] - `true` is vertical lines, `false` is horizontal
     * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
     * @param {number} [options.noiseSize=1.0] - The size of the noise particles
     * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
     * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
     *        values produces a smaller vignette
     * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
     * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
     * @param {number} [options.time=0] - For animating interlaced lines
     */
    function CRTFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        /** For animating interlaced lines */
        _this.time = 0;
        /** A seed value to apply to the random noise generation */
        _this.seed = 0;
        _this.uniforms.dimensions = new Float32Array(2);
        Object.assign(_this, CRTFilter.defaults, options);
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    CRTFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a = input.filterFrame, width = _a.width, height = _a.height;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.seed = this.seed;
        this.uniforms.time = this.time;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(CRTFilter.prototype, "curvature", {
        get: function () {
            return this.uniforms.curvature;
        },
        /**
         * Bent of interlaced lines, higher value means more bend
         *
         * @member {number}
         * @default 1
         */
        set: function (value) {
            this.uniforms.curvature = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "lineWidth", {
        get: function () {
            return this.uniforms.lineWidth;
        },
        /**
         * Width of interlaced lines
         *
         * @member {number}
         * @default 1
         */
        set: function (value) {
            this.uniforms.lineWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "lineContrast", {
        get: function () {
            return this.uniforms.lineContrast;
        },
        /**
         * Contrast of interlaced lines
         *
         * @member {number}
         * @default 0.25
         */
        set: function (value) {
            this.uniforms.lineContrast = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "verticalLine", {
        get: function () {
            return this.uniforms.verticalLine;
        },
        /**
         * `true` for vertical lines, `false` for horizontal lines
         *
         * @member {boolean}
         * @default false
         */
        set: function (value) {
            this.uniforms.verticalLine = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "noise", {
        get: function () {
            return this.uniforms.noise;
        },
        /**
         * Opacity/intensity of the noise effect between `0` and `1`
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.noise = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "noiseSize", {
        get: function () {
            return this.uniforms.noiseSize;
        },
        /**
         * The size of the noise particles
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.noiseSize = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "vignetting", {
        get: function () {
            return this.uniforms.vignetting;
        },
        /**
         * The radius of the vignette effect, smaller
         * values produces a smaller vignette
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.vignetting = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "vignettingAlpha", {
        get: function () {
            return this.uniforms.vignettingAlpha;
        },
        /**
         * Amount of opacity of vignette
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.vignettingAlpha = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CRTFilter.prototype, "vignettingBlur", {
        get: function () {
            return this.uniforms.vignettingBlur;
        },
        /**
         * Blur intensity of the vignette
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.vignettingBlur = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options */
    CRTFilter.defaults = {
        curvature: 1.0,
        lineWidth: 1.0,
        lineContrast: 0.25,
        verticalLine: false,
        noise: 0.0,
        noiseSize: 1.0,
        seed: 0.0,
        vignetting: 0.3,
        vignettingAlpha: 1.0,
        vignettingBlur: 0.3,
        time: 0.0,
    };
    return CRTFilter;
}(Filter));

export { CRTFilter };
//# sourceMappingURL=filter-crt.esm.js.map
