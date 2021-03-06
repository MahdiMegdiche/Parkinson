/*!
 * @pixi/filter-motion-blur - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-motion-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@pixi/core');
var math = require('@pixi/math');

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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\n// Notice:\n// the perfect way:\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    vec2 velocity = uVelocity / filterArea.xy;\n    float offset = -uOffset / length(uVelocity) - 0.5;\n    int k = uKernelSize - 1;\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / float(k) + offset);\n        color += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor = color / float(uKernelSize);\n}\n";

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-motion-blur|@pixi/filter-motion-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var MotionBlurFilter = /** @class */ (function (_super) {
    __extends(MotionBlurFilter, _super);
    /**
     * @param {PIXI.ObservablePoint|PIXI.Point|number[]} [velocity=[0, 0]] - Sets the velocity of the motion for blur effect.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 5
     * @param {number} [offset=0] - The offset of the blur filter.
     */
    function MotionBlurFilter(velocity, kernelSize, offset) {
        if (velocity === void 0) { velocity = [0, 0]; }
        if (kernelSize === void 0) { kernelSize = 5; }
        if (offset === void 0) { offset = 0; }
        var _this = _super.call(this, vertex, fragment) || this;
        /**
         * The kernelSize of the blur, higher values are slower but look better.
         * Use odd value greater than 5.
         */
        _this.kernelSize = 5;
        _this.uniforms.uVelocity = new Float32Array(2);
        _this._velocity = new math.ObservablePoint(_this.velocityChanged, _this);
        _this.setVelocity(velocity);
        _this.kernelSize = kernelSize;
        _this.offset = offset;
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    MotionBlurFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a = this.velocity, x = _a.x, y = _a.y;
        this.uniforms.uKernelSize = (x !== 0 || y !== 0) ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(MotionBlurFilter.prototype, "velocity", {
        get: function () {
            return this._velocity;
        },
        /**
         * Sets the velocity of the motion for blur effect.
         *
         * @member {PIXI.ObservablePoint|PIXI.Point|number[]}
         */
        set: function (value) {
            this.setVelocity(value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set velocity with more broad types
     */
    MotionBlurFilter.prototype.setVelocity = function (value) {
        if (Array.isArray(value)) {
            var x = value[0], y = value[1];
            this._velocity.set(x, y);
        }
        else {
            this._velocity.copyFrom(value);
        }
    };
    /**
     * Handle velocity changed
     * @private
     */
    MotionBlurFilter.prototype.velocityChanged = function () {
        this.uniforms.uVelocity[0] = this._velocity.x;
        this.uniforms.uVelocity[1] = this._velocity.y;
        // The padding will be increased as the velocity and intern the blur size is changed
        this.padding = (Math.max(Math.abs(this._velocity.x), Math.abs(this._velocity.y)) >> 0) + 1;
    };
    Object.defineProperty(MotionBlurFilter.prototype, "offset", {
        get: function () {
            return this.uniforms.uOffset;
        },
        /**
         * The offset of the blur filter.
         *
         * @member {number}
         * @default 0
         */
        set: function (value) {
            this.uniforms.uOffset = value;
        },
        enumerable: false,
        configurable: true
    });
    return MotionBlurFilter;
}(core.Filter));

exports.MotionBlurFilter = MotionBlurFilter;
//# sourceMappingURL=filter-motion-blur.cjs.js.map
