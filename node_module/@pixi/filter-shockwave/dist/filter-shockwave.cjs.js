/*!
 * @pixi/filter-shockwave - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-shockwave is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n";

/**
 * The ShockwaveFilter class lets you apply a shockwave effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/shockwave.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-shockwave|@pixi/filter-shockwave}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var ShockwaveFilter = /** @class */ (function (_super) {
    __extends(ShockwaveFilter, _super);
    /**
     * @param {PIXI.Point|number[]} [center=[0.5, 0.5]] - See `center` property.
     * @param {object} [options] - The optional parameters of shockwave filter.
     * @param {number} [options.amplitude=0.5] - See `amplitude`` property.
     * @param {number} [options.wavelength=1.0] - See `wavelength` property.
     * @param {number} [options.speed=500.0] - See `speed` property.
     * @param {number} [options.brightness=8] - See `brightness` property.
     * @param {number} [options.radius=4] - See `radius` property.
     * @param {number} [time=0] - See `time` property.
     */
    function ShockwaveFilter(center, options, time) {
        if (center === void 0) { center = [0, 0]; }
        if (time === void 0) { time = 0; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.center = center;
        Object.assign(_this, ShockwaveFilter.defaults, options);
        _this.time = time;
        return _this;
    }
    ShockwaveFilter.prototype.apply = function (filterManager, input, output, clear) {
        // There is no set/get of `time`, for performance.
        // Because in the most real cases, `time` will be changed in ever game tick.
        // Use set/get will take more function-call.
        this.uniforms.time = this.time;
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(ShockwaveFilter.prototype, "center", {
        /**
         * Sets the center of the shockwave in normalized screen coords. That is
         * (0,0) is the top-left and (1,1) is the bottom right.
         *
         * @member {PIXI.Point|number[]}
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
    Object.defineProperty(ShockwaveFilter.prototype, "amplitude", {
        /**
         * The amplitude of the shockwave.
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.amplitude;
        },
        set: function (value) {
            this.uniforms.amplitude = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShockwaveFilter.prototype, "wavelength", {
        /**
         * The wavelength of the shockwave.
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.wavelength;
        },
        set: function (value) {
            this.uniforms.wavelength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShockwaveFilter.prototype, "brightness", {
        /**
         * The brightness of the shockwave.
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.brightness;
        },
        set: function (value) {
            this.uniforms.brightness = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShockwaveFilter.prototype, "speed", {
        /**
         * The speed about the shockwave ripples out.
         * The unit is `pixel/second`
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.speed;
        },
        set: function (value) {
            this.uniforms.speed = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShockwaveFilter.prototype, "radius", {
        /**
         * The maximum radius of shockwave.
         * `< 0.0` means it's infinity.
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
    /** Default constructor options. */
    ShockwaveFilter.defaults = {
        amplitude: 30.0,
        wavelength: 160.0,
        brightness: 1.0,
        speed: 500.0,
        radius: -1.0,
    };
    return ShockwaveFilter;
}(core.Filter));

exports.ShockwaveFilter = ShockwaveFilter;
//# sourceMappingURL=filter-shockwave.cjs.js.map
