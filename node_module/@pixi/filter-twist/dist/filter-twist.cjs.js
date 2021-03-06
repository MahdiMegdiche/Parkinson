/*!
 * @pixi/filter-twist - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-twist is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-twist|@pixi/filter-twist}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var TwistFilter = /** @class */ (function (_super) {
    __extends(TwistFilter, _super);
    /**
     * @param {object} [options] - Object object to use.
     * @param {number} [options.radius=200] - The radius of the twist.
     * @param {number} [options.angle=4] - The angle of the twist.
     * @param {number} [options.padding=20] - Padding for filter area.
     * @param {number} [options.offset] - Center of twist, in local, pixel coordinates.
     */
    function TwistFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        Object.assign(_this, TwistFilter.defaults, options);
        return _this;
    }
    Object.defineProperty(TwistFilter.prototype, "offset", {
        /**
         * This point describes the the offset of the twist.
         *
         * @member {PIXI.Point}
         */
        get: function () {
            return this.uniforms.offset;
        },
        set: function (value) {
            this.uniforms.offset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TwistFilter.prototype, "radius", {
        /**
         * The radius of the twist.
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
    Object.defineProperty(TwistFilter.prototype, "angle", {
        /**
         * The angle of the twist.
         *
         * @member {number}
         */
        get: function () {
            return this.uniforms.angle;
        },
        set: function (value) {
            this.uniforms.angle = value;
        },
        enumerable: false,
        configurable: true
    });
    /** Default constructor options. */
    TwistFilter.defaults = {
        radius: 200,
        angle: 4,
        padding: 20,
        offset: new math.Point(),
    };
    return TwistFilter;
}(core.Filter));

exports.TwistFilter = TwistFilter;
//# sourceMappingURL=filter-twist.cjs.js.map
