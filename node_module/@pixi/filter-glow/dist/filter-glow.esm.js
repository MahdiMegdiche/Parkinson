/*!
 * @pixi/filter-glow - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-glow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { rgb2hex, hex2rgb } from '@pixi/utils';

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

var fragment = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float outerStrength;\nuniform float innerStrength;\n\nuniform vec4 glowColor;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform bool knockout;\n\nconst float PI = 3.14159265358979323846264;\n\nconst float DIST = __DIST__;\nconst float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);\nconst float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);\n\nconst float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\n    float totalAlpha = 0.0;\n\n    vec2 direction;\n    vec2 displaced;\n    vec4 curColor;\n\n    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {\n       direction = vec2(cos(angle), sin(angle)) * px;\n\n       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {\n           displaced = clamp(vTextureCoord + direction * \n                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);\n\n           curColor = texture2D(uSampler, displaced);\n\n           totalAlpha += (DIST - curDistance) * curColor.a;\n       }\n    }\n    \n    curColor = texture2D(uSampler, vTextureCoord);\n\n    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);\n\n    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;\n    float innerGlowStrength = min(1.0, innerGlowAlpha);\n    \n    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);\n\n    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);\n    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);\n\n    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;\n    \n    if (knockout) {\n      float resultAlpha = outerGlowAlpha + innerGlowAlpha;\n      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);\n    }\n    else {\n      gl_FragColor = innerColor + outerGlowColor;\n    }\n}\n";

/**
 * GlowFilter, originally by mishaa
 * [codepen]{@link http://codepen.io/mishaa/pen/raKzrm}.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glow|@pixi/filter-glow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter({ distance: 15, outerStrength: 2 })
 *  ];
 */
var GlowFilter = /** @class */ (function (_super) {
    __extends(GlowFilter, _super);
    /**
     * @param {number} [options] - Options for glow.
     * @param {number} [options.distance=10] - The distance of the glow. Make it 2 times more for resolution=2.
     *        It can't be changed after filter creation.
     * @param {number} [options.outerStrength=4] - The strength of the glow outward from the edge of the sprite.
     * @param {number} [options.innerStrength=0] - The strength of the glow inward from the edge of the sprite.
     * @param {number} [options.color=0xffffff] - The color of the glow.
     * @param {number} [options.quality=0.1] - A number between 0 and 1 that describes the quality of the glow.
     *        The higher the number the less performant.
     * @param {boolean} [options.knockout=false] - Toggle to hide the contents and only show glow.
     */
    function GlowFilter(options) {
        var _this = this;
        var opts = Object.assign({}, GlowFilter.defaults, options);
        var outerStrength = opts.outerStrength, innerStrength = opts.innerStrength, color = opts.color, knockout = opts.knockout, quality = opts.quality;
        var distance = Math.round(opts.distance);
        _this = _super.call(this, vertex, fragment
            .replace(/__ANGLE_STEP_SIZE__/gi, "" + (1 / quality / distance).toFixed(7))
            .replace(/__DIST__/gi, distance.toFixed(0) + ".0")) || this;
        _this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        Object.assign(_this, {
            color: color,
            outerStrength: outerStrength,
            innerStrength: innerStrength,
            padding: distance,
            knockout: knockout,
        });
        return _this;
    }
    Object.defineProperty(GlowFilter.prototype, "color", {
        /**
         * The color of the glow.
         * @member {number}
         * @default 0xFFFFFF
         */
        get: function () {
            return rgb2hex(this.uniforms.glowColor);
        },
        set: function (value) {
            hex2rgb(value, this.uniforms.glowColor);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "outerStrength", {
        /**
         * The strength of the glow outward from the edge of the sprite.
         * @member {number}
         * @default 4
         */
        get: function () {
            return this.uniforms.outerStrength;
        },
        set: function (value) {
            this.uniforms.outerStrength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "innerStrength", {
        /**
         * The strength of the glow inward from the edge of the sprite.
         * @member {number}
         * @default 0
         */
        get: function () {
            return this.uniforms.innerStrength;
        },
        set: function (value) {
            this.uniforms.innerStrength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "knockout", {
        /**
         * Only draw the glow, not the texture itself
         * @member {boolean}
         * @default false
         */
        get: function () {
            return this.uniforms.knockout;
        },
        set: function (value) {
            this.uniforms.knockout = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default values for options. */
    GlowFilter.defaults = {
        distance: 10,
        outerStrength: 4,
        innerStrength: 0,
        color: 0xffffff,
        quality: 0.1,
        knockout: false,
    };
    return GlowFilter;
}(Filter));

export { GlowFilter };
//# sourceMappingURL=filter-glow.esm.js.map
