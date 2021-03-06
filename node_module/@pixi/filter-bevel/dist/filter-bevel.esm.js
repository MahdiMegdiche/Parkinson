/*!
 * @pixi/filter-bevel - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-bevel is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { DEG_TO_RAD } from '@pixi/math';
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

var fragment = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float transformX;\nuniform float transformY;\nuniform vec3 lightColor;\nuniform float lightAlpha;\nuniform vec3 shadowColor;\nuniform float shadowAlpha;\n\nvoid main(void) {\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\n\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\n}\n";

/**
 * Bevel Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bevel.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bevel|@pixi/filter-bevel}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var BevelFilter = /** @class */ (function (_super) {
    __extends(BevelFilter, _super);
    /**
     * @param {object} [options] - The optional parameters of the filter.
     * @param {number} [options.rotation = 45] - The angle of the light in degrees.
     * @param {number} [options.thickness = 2] - The tickness of the bevel.
     * @param {number} [options.lightColor = 0xffffff] - Color of the light.
     * @param {number} [options.lightAlpha = 0.7] - Alpha of the light.
     * @param {number} [options.shadowColor = 0x000000] - Color of the shadow.
     * @param {number} [options.shadowAlpha = 0.7] - Alpha of the shadow.
     */
    function BevelFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        _this._thickness = 2;
        _this._angle = 0;
        _this.uniforms.lightColor = new Float32Array(3);
        _this.uniforms.shadowColor = new Float32Array(3);
        Object.assign(_this, {
            rotation: 45,
            thickness: 2,
            lightColor: 0xffffff,
            lightAlpha: 0.7,
            shadowColor: 0x000000,
            shadowAlpha: 0.7,
        }, options);
        // Workaround: https://github.com/pixijs/filters/issues/230
        // applies correctly only if there is at least a single-pixel padding with alpha=0 around an image
        // To solve this problem, a padding of 1 put on the filter should suffice
        _this.padding = 1;
        return _this;
    }
    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    BevelFilter.prototype._updateTransform = function () {
        this.uniforms.transformX = this._thickness * Math.cos(this._angle);
        this.uniforms.transformY = this._thickness * Math.sin(this._angle);
    };
    Object.defineProperty(BevelFilter.prototype, "rotation", {
        /**
         * The angle of the light in degrees.
         * @member {number}
         * @default 45
         */
        get: function () {
            return this._angle / DEG_TO_RAD;
        },
        set: function (value) {
            this._angle = value * DEG_TO_RAD;
            this._updateTransform();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BevelFilter.prototype, "thickness", {
        /**
         * The tickness of the bevel.
         * @member {number}
         * @default 2
         */
        get: function () {
            return this._thickness;
        },
        set: function (value) {
            this._thickness = value;
            this._updateTransform();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BevelFilter.prototype, "lightColor", {
        /**
         * Color of the light.
         * @member {number}
         * @default 0xffffff
         */
        get: function () {
            return rgb2hex(this.uniforms.lightColor);
        },
        set: function (value) {
            hex2rgb(value, this.uniforms.lightColor);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BevelFilter.prototype, "lightAlpha", {
        /**
         * Alpha of the light.
         * @member {number}
         * @default 0.7
         */
        get: function () {
            return this.uniforms.lightAlpha;
        },
        set: function (value) {
            this.uniforms.lightAlpha = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BevelFilter.prototype, "shadowColor", {
        /**
         * Color of the shadow.
         * @member {number}
         * @default 0x000000
         */
        get: function () {
            return rgb2hex(this.uniforms.shadowColor);
        },
        set: function (value) {
            hex2rgb(value, this.uniforms.shadowColor);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BevelFilter.prototype, "shadowAlpha", {
        /**
         * Alpha of the shadow.
         * @member {number}
         * @default 0.7
         */
        get: function () {
            return this.uniforms.shadowAlpha;
        },
        set: function (value) {
            this.uniforms.shadowAlpha = value;
        },
        enumerable: false,
        configurable: true
    });
    return BevelFilter;
}(Filter));

export { BevelFilter };
//# sourceMappingURL=filter-bevel.esm.js.map
