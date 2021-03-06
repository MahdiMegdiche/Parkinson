/*!
 * @pixi/filter-radial-blur - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-radial-blur is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    float aspect = filterArea.y / filterArea.x;\n    vec2 center = uCenter.xy / filterArea.xy;\n    float gradient = uRadius / filterArea.x * 0.3;\n    float radius = uRadius / filterArea.x - gradient * 0.5;\n    int k = uKernelSize - 1;\n\n    vec2 coord = vTextureCoord;\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep = uRadian;\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            gl_FragColor = color;\n            return;\n        }\n        radianStep *= scale;\n    }\n    radianStep /= float(k);\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample;\n    }\n\n    gl_FragColor = color / float(uKernelSize);\n}\n";

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/radial-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-radial-blur|@pixi/filter-radial-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var RadialBlurFilter = /** @class */ (function (_super) {
    __extends(RadialBlurFilter, _super);
    /**
     * @param {number} [angle=0] - Sets the angle of the motion for blur effect.
     * @param {PIXI.Point|number[]} [center=[0,0]] - The center of the radial.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 3
     * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
     */
    function RadialBlurFilter(angle, center, kernelSize, radius) {
        if (angle === void 0) { angle = 0; }
        if (center === void 0) { center = [0, 0]; }
        if (kernelSize === void 0) { kernelSize = 5; }
        if (radius === void 0) { radius = -1; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this._angle = 0;
        _this.angle = angle;
        _this.center = center;
        _this.kernelSize = kernelSize;
        _this.radius = radius;
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    RadialBlurFilter.prototype.apply = function (filterManager, input, output, clear) {
        this.uniforms.uKernelSize = this._angle !== 0 ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(RadialBlurFilter.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        /**
         * Sets the angle in degrees of the motion for blur effect.
         *
         * @member {PIXI.Point|number[]}
         * @default 0
         */
        set: function (value) {
            this._angle = value;
            this.uniforms.uRadian = value * Math.PI / 180;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadialBlurFilter.prototype, "center", {
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
    Object.defineProperty(RadialBlurFilter.prototype, "radius", {
        /**
         * Outer radius of the effect. The default value of `-1` is infinite.
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
    return RadialBlurFilter;
}(Filter));

export { RadialBlurFilter };
//# sourceMappingURL=filter-radial-blur.esm.js.map
