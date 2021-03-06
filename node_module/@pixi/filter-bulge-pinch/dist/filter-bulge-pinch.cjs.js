/*!
 * @pixi/filter-bulge-pinch - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-bulge-pinch is licensed under the MIT License.
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

var fragment = "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    gl_FragColor = color;\n}\n";

// @author Julien CLEREL @JuloxRox
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js
// by Evan Wallace : http://madebyevan.com/
/**
 * Bulges or pinches the image in a circle.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bulge-pinch.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bulge-pinch|@pixi/filter-bulge-pinch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var BulgePinchFilter = /** @class */ (function (_super) {
    __extends(BulgePinchFilter, _super);
    /**
     * @param {object} [options] - Options to use for filter.
     * @param {PIXI.Point|Array<number>} [options.center=[0,0]] - The x and y coordinates of the center
     *        of the circle of effect.
     * @param {number} [options.radius=100] - The radius of the circle of effect.
     * @param {number} [options.strength=1] - -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     */
    function BulgePinchFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        _this.uniforms.dimensions = new Float32Array(2);
        Object.assign(_this, BulgePinchFilter.defaults, options);
        return _this;
    }
    BulgePinchFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a = input.filterFrame, width = _a.width, height = _a.height;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(BulgePinchFilter.prototype, "radius", {
        /**
         * The radius of the circle of effect.
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.radius;
        },
        set: function (value) {
            this.uniforms.radius = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BulgePinchFilter.prototype, "strength", {
        /**
         * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.strength;
        },
        set: function (value) {
            this.uniforms.strength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BulgePinchFilter.prototype, "center", {
        /**
         * The x and y coordinates of the center of the circle of effect.
         *
         * @member {PIXI.Point | Array<number>}
         */
        get: function () {
            return this.uniforms.center;
        },
        set: function (value) {
            this.uniforms.center = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options. */
    BulgePinchFilter.defaults = {
        center: [0.5, 0.5],
        radius: 100,
        strength: 1,
    };
    return BulgePinchFilter;
}(core.Filter));

exports.BulgePinchFilter = BulgePinchFilter;
//# sourceMappingURL=filter-bulge-pinch.cjs.js.map
