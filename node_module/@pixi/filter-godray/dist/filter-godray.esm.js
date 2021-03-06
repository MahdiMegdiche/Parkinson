/*!
 * @pixi/filter-godray - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-godray is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { Point, DEG_TO_RAD } from '@pixi/math';

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

var perlin = "vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n";

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\nuniform float alpha;\n\n${perlin}\n\nvoid main(void) {\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    // apply user alpha\n    mist *= alpha;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\n\n}\n";

/**
 * GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
 *
 *
 *
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-godray|@pixi/filter-godray}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  displayObject.filters = [new GodrayFilter()];
 */
var GodrayFilter = /** @class */ (function (_super) {
    __extends(GodrayFilter, _super);
    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.angle=30] - Angle/Light-source of the rays.
     * @param {number} [options.gain=0.5] - General intensity of the effect.
     * @param {number} [options.lacunarity=2.5] - The density of the fractal noise.
     * @param {boolean} [options.parallel=true] - `true` to use `angle`, `false` to use `center`
     * @param {number} [options.time=0] - The current time position.
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - Focal point for non-parallel rays,
     *        to use this `parallel` must be set to `false`.
 * @param {number} [options.alpha=1.0] - the alpha, defaults to 1, affects transparency of rays
     */
    function GodrayFilter(options) {
        var _this = _super.call(this, vertex, fragment.replace('${perlin}', perlin)) || this;
        /**
         * `true` if light rays are parallel (uses angle),
         * `false` to use the focal `center` point
         */
        _this.parallel = true;
        /** The current time. */
        _this.time = 0;
        _this._angle = 0;
        _this.uniforms.dimensions = new Float32Array(2);
        var opts = Object.assign(GodrayFilter.defaults, options);
        _this._angleLight = new Point();
        _this.angle = opts.angle;
        _this.gain = opts.gain;
        _this.lacunarity = opts.lacunarity;
        _this.alpha = opts.alpha;
        _this.parallel = opts.parallel;
        _this.center = opts.center;
        _this.time = opts.time;
        return _this;
    }
    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    GodrayFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a = input.filterFrame, width = _a.width, height = _a.height;
        this.uniforms.light = this.parallel ? this._angleLight : this.center;
        this.uniforms.parallel = this.parallel;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.time = this.time;
        this.uniforms.alpha = this.alpha;
        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(GodrayFilter.prototype, "angle", {
        /**
         * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
         *     values of 90 or -90 produce horizontal rays.
         * @member {number}
         * @default 30
         */
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = value;
            var radians = value * DEG_TO_RAD;
            this._angleLight.x = Math.cos(radians);
            this._angleLight.y = Math.sin(radians);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GodrayFilter.prototype, "gain", {
        /**
         * General intensity of the effect. A value closer to 1 will produce a more intense effect,
         * where a value closer to 0 will produce a subtler effect.
         *
         * @member {number}
         * @default 0.5
         */
        get: function () {
            return this.uniforms.gain;
        },
        set: function (value) {
            this.uniforms.gain = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GodrayFilter.prototype, "lacunarity", {
        /**
         * The density of the fractal noise. A higher amount produces more rays and a smaller amound
         * produces fewer waves.
         *
         * @member {number}
         * @default 2.5
         */
        get: function () {
            return this.uniforms.lacunarity;
        },
        set: function (value) {
            this.uniforms.lacunarity = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GodrayFilter.prototype, "alpha", {
        /**
         * The alpha (opacity) of the rays.  0 is fully transparent, 1 is fully opaque
         * @member {number}
         * @default 1
         */
        get: function () {
            return this.uniforms.alpha;
        },
        set: function (value) {
            this.uniforms.alpha = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default for constructior options. */
    GodrayFilter.defaults = {
        angle: 30,
        gain: 0.5,
        lacunarity: 2.5,
        time: 0,
        parallel: true,
        center: [0, 0],
        alpha: 1,
    };
    return GodrayFilter;
}(Filter));

export { GodrayFilter };
//# sourceMappingURL=filter-godray.esm.js.map
