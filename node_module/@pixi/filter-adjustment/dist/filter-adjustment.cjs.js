/*!
 * @pixi/filter-adjustment - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-adjustment is licensed under the MIT License.
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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n";

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift.
 * This is a faster and much simpler to use than
 * {@link http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-adjustment|@pixi/filter-adjustment}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var AdjustmentFilter = /** @class */ (function (_super) {
    __extends(AdjustmentFilter, _super);
    /**
     * @param {object|number} [options] - The optional parameters of the filter.
     * @param {number} [options.gamma=1] - The amount of luminance
     * @param {number} [options.saturation=1] - The amount of color saturation
     * @param {number} [options.contrast=1] - The amount of contrast
     * @param {number} [options.brightness=1] - The overall brightness
     * @param {number} [options.red=1] - The multipled red channel
     * @param {number} [options.green=1] - The multipled green channel
     * @param {number} [options.blue=1] - The multipled blue channel
     * @param {number} [options.alpha=1] - The overall alpha amount
     */
    function AdjustmentFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        /** The amount of luminance */
        _this.gamma = 1;
        /** The amount of saturation */
        _this.saturation = 1;
        /** The amount of contrast */
        _this.contrast = 1;
        /** The amount of brightness */
        _this.brightness = 1;
        /** The amount of red channel */
        _this.red = 1;
        /** The amount of green channel */
        _this.green = 1;
        /** The amount of blue channel */
        _this.blue = 1;
        /** The amount of alpha channel */
        _this.alpha = 1;
        Object.assign(_this, options);
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @ignore
     */
    AdjustmentFilter.prototype.apply = function (filterManager, input, output, clear) {
        this.uniforms.gamma = Math.max(this.gamma, 0.0001);
        this.uniforms.saturation = this.saturation;
        this.uniforms.contrast = this.contrast;
        this.uniforms.brightness = this.brightness;
        this.uniforms.red = this.red;
        this.uniforms.green = this.green;
        this.uniforms.blue = this.blue;
        this.uniforms.alpha = this.alpha;
        filterManager.applyFilter(this, input, output, clear);
    };
    return AdjustmentFilter;
}(core.Filter));

exports.AdjustmentFilter = AdjustmentFilter;
//# sourceMappingURL=filter-adjustment.cjs.js.map
