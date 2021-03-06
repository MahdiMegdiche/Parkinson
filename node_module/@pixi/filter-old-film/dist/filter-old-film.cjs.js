/*!
 * @pixi/filter-old-film - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-old-film is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n";

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/old-film.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-old-film|@pixi/filter-old-film}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var OldFilmFilter = /** @class */ (function (_super) {
    __extends(OldFilmFilter, _super);
    /**
     * @param {object|number} [options] - The optional parameters of old film effect.
     *                        When options is a number , it will be `seed`
     * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
     *        a value of `1` is more saturation and closer to `0` is less, and a value of
     *        `0` produces no sepia effect
     * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
     * @param {number} [options.noiseSize=1.0] - The size of the noise particles
     * @param {number} [options.scratch=0.5] - How often scratches appear
     * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
     * @param {number} [options.scratchWidth=1.0] - The width of the scratches
     * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
     *        values produces a smaller vignette
     * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
     * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
     * @param {number} [seed=0] - A see value to apply to the random noise generation
     */
    function OldFilmFilter(options, seed) {
        if (seed === void 0) { seed = 0; }
        var _this = _super.call(this, vertex, fragment) || this;
        /** A see value to apply to the random noise generation */
        _this.seed = 0;
        _this.uniforms.dimensions = new Float32Array(2);
        if (typeof options === 'number') {
            _this.seed = options;
            options = undefined;
        }
        else {
            _this.seed = seed;
        }
        Object.assign(_this, OldFilmFilter.defaults, options);
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    OldFilmFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a, _b;
        this.uniforms.dimensions[0] = (_a = input.filterFrame) === null || _a === void 0 ? void 0 : _a.width;
        this.uniforms.dimensions[1] = (_b = input.filterFrame) === null || _b === void 0 ? void 0 : _b.height;
        // named `seed` because in the most programming languages,
        // `random` used for "the function for generating random value".
        this.uniforms.seed = this.seed;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(OldFilmFilter.prototype, "sepia", {
        get: function () {
            return this.uniforms.sepia;
        },
        /**
         * The amount of saturation of sepia effect,
         * a value of `1` is more saturation and closer to `0` is less,
         * and a value of `0` produces no sepia effect
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.sepia = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OldFilmFilter.prototype, "noise", {
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
    Object.defineProperty(OldFilmFilter.prototype, "noiseSize", {
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
    Object.defineProperty(OldFilmFilter.prototype, "scratch", {
        get: function () {
            return this.uniforms.scratch;
        },
        /**
         * How often scratches appear
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.scratch = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OldFilmFilter.prototype, "scratchDensity", {
        get: function () {
            return this.uniforms.scratchDensity;
        },
        /**
         * The density of the number of scratches
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.scratchDensity = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OldFilmFilter.prototype, "scratchWidth", {
        get: function () {
            return this.uniforms.scratchWidth;
        },
        /**
         * The width of the scratches
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.scratchWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OldFilmFilter.prototype, "vignetting", {
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
    Object.defineProperty(OldFilmFilter.prototype, "vignettingAlpha", {
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
    Object.defineProperty(OldFilmFilter.prototype, "vignettingBlur", {
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
    OldFilmFilter.defaults = {
        sepia: 0.3,
        noise: 0.3,
        noiseSize: 1.0,
        scratch: 0.5,
        scratchDensity: 0.3,
        scratchWidth: 1.0,
        vignetting: 0.3,
        vignettingAlpha: 1.0,
        vignettingBlur: 0.3,
    };
    return OldFilmFilter;
}(core.Filter));

exports.OldFilmFilter = OldFilmFilter;
//# sourceMappingURL=filter-old-film.cjs.js.map
