/*!
 * @pixi/filter-zoom-blur - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-zoom-blur is licensed under the MIT License.
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

function __rest(s, e) {
    var t = {};
    for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        { t[p] = s[p]; } }
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        { for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                { t[p[i]] = s[p[i]]; }
        } }
    return t;
}

var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = ${maxKernelSize};\n\n// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand(vec2 co, float seed) {\n    const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);\n    return fract(sin(sn) * c + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = rand(vTextureCoord, 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    // color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n";

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-zoom-blur|@pixi/filter-zoom-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var ZoomBlurFilter = /** @class */ (function (_super) {
    __extends(ZoomBlurFilter, _super);
    /**
     * @param {object} [options] - Filter options to use.
     * @param {number} [options.strength=0.1] - Sets the strength of the zoom blur effect
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - The center of the zoom.
     * @param {number} [options.innerRadius=0] - The inner radius of zoom. The part in inner circle won't apply
     *        zoom blur effect.
     * @param {number} [options.radius=-1] - See `radius` property.
     * @param {number} [options.maxKernelSize=32] - On older iOS devices, it's better to not go above `13.0`.
     *        Decreasing this value will produce a lower-quality blur effect with more dithering.
     */
    function ZoomBlurFilter(options) {
        var _this = this;
        var _a = Object.assign(ZoomBlurFilter.defaults, options), maxKernelSize = _a.maxKernelSize, rest = __rest(_a, ["maxKernelSize"]);
        _this = _super.call(this, vertex, fragment.replace('${maxKernelSize}', maxKernelSize.toFixed(1))) || this;
        Object.assign(_this, rest);
        return _this;
    }
    Object.defineProperty(ZoomBlurFilter.prototype, "center", {
        /**
         * Center of the effect.
         *
         * @member {PIXI.Point|number[]}
         * @default [0, 0]
         */
        get: function () {
            return this.uniforms.uCenter;
        },
        set: function (value) {
            this.uniforms.uCenter = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomBlurFilter.prototype, "strength", {
        /**
         * Intensity of the zoom effect.
         *
         * @member {number}
         * @default 0.1
         */
        get: function () {
            return this.uniforms.uStrength;
        },
        set: function (value) {
            this.uniforms.uStrength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomBlurFilter.prototype, "innerRadius", {
        /**
         * Radius of the inner region not effected by blur.
         *
         * @member {number}
         * @default 0
         */
        get: function () {
            return this.uniforms.uInnerRadius;
        },
        set: function (value) {
            this.uniforms.uInnerRadius = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomBlurFilter.prototype, "radius", {
        /**
         * Outer radius of the effect. The default value is `-1`.
         * `< 0.0` means it's infinity.
         *
         * @member {number}
         * @default -1
         */
        get: function () {
            return this.uniforms.uRadius;
        },
        set: function (value) {
            if (value < 0 || value === Infinity) {
                value = -1;
            }
            this.uniforms.uRadius = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options. */
    ZoomBlurFilter.defaults = {
        strength: 0.1,
        center: [0, 0],
        innerRadius: 0,
        radius: -1,
        maxKernelSize: 32,
    };
    return ZoomBlurFilter;
}(Filter));

export { ZoomBlurFilter };
//# sourceMappingURL=filter-zoom-blur.esm.js.map
