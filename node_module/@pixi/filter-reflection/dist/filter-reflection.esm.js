/*!
 * @pixi/filter-reflection - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-reflection is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n";

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-reflection|@pixi/filter-reflection}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var ReflectionFilter = /** @class */ (function (_super) {
    __extends(ReflectionFilter, _super);
    /**
     * @param {object} [options] - The optional parameters of Reflection effect.
     * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
     * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
     *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
     * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
     * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
     * @param {number} [options.time=0] - Time for animating position of waves
     */
    function ReflectionFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        /** Time for animating position of waves */
        _this.time = 0;
        _this.uniforms.amplitude = new Float32Array(2);
        _this.uniforms.waveLength = new Float32Array(2);
        _this.uniforms.alpha = new Float32Array(2);
        _this.uniforms.dimensions = new Float32Array(2);
        Object.assign(_this, ReflectionFilter.defaults, options);
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    ReflectionFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a, _b;
        this.uniforms.dimensions[0] = (_a = input.filterFrame) === null || _a === void 0 ? void 0 : _a.width;
        this.uniforms.dimensions[1] = (_b = input.filterFrame) === null || _b === void 0 ? void 0 : _b.height;
        this.uniforms.time = this.time;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(ReflectionFilter.prototype, "mirror", {
        get: function () {
            return this.uniforms.mirror;
        },
        /**
         * `true` to reflect the image, `false` for waves-only
         *
         * @member {boolean}
         * @default true
         */
        set: function (value) {
            this.uniforms.mirror = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionFilter.prototype, "boundary", {
        get: function () {
            return this.uniforms.boundary;
        },
        /**
         * Vertical position of the reflection point, default is 50% (middle)
         * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
         *
         * @member {number}
         * @default 0.5
         */
        set: function (value) {
            this.uniforms.boundary = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionFilter.prototype, "amplitude", {
        get: function () {
            return this.uniforms.amplitude;
        },
        /**
         * Starting and ending amplitude of waves
         * @member {number[]}
         * @default [0, 20]
         */
        set: function (value) {
            this.uniforms.amplitude[0] = value[0];
            this.uniforms.amplitude[1] = value[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionFilter.prototype, "waveLength", {
        get: function () {
            return this.uniforms.waveLength;
        },
        /**
         * Starting and ending length of waves
         * @member {number[]}
         * @default [30, 100]
         */
        set: function (value) {
            this.uniforms.waveLength[0] = value[0];
            this.uniforms.waveLength[1] = value[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionFilter.prototype, "alpha", {
        get: function () {
            return this.uniforms.alpha;
        },
        /**
         * Starting and ending alpha values
         * @member {number[]}
         * @default [1, 1]
         */
        set: function (value) {
            this.uniforms.alpha[0] = value[0];
            this.uniforms.alpha[1] = value[1];
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options */
    ReflectionFilter.defaults = {
        mirror: true,
        boundary: 0.5,
        amplitude: [0, 20],
        waveLength: [30, 100],
        alpha: [1, 1],
        time: 0,
    };
    return ReflectionFilter;
}(Filter));

export { ReflectionFilter };
//# sourceMappingURL=filter-reflection.esm.js.map
