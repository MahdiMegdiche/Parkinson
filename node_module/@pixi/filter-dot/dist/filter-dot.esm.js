/*!
 * @pixi/filter-dot - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-dot is licensed under the MIT License.
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

var fragment = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n";

// @author Mat Groves http://matgroves.com/ @Doormat23
// original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-dot|@pixi/filter-dot}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var DotFilter = /** @class */ (function (_super) {
    __extends(DotFilter, _super);
    /**
     * @param {number} [scale=1] - The scale of the effect.
     * @param {number} [angle=5] - The radius of the effect.
     */
    function DotFilter(scale, angle) {
        if (scale === void 0) { scale = 1; }
        if (angle === void 0) { angle = 5; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.scale = scale;
        _this.angle = angle;
        return _this;
    }
    Object.defineProperty(DotFilter.prototype, "scale", {
        /**
         * The scale of the effect.
         * @member {number}
         * @default 1
         */
        get: function () {
            return this.uniforms.scale;
        },
        set: function (value) {
            this.uniforms.scale = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DotFilter.prototype, "angle", {
        /**
         * The radius of the effect.
         * @member {number}
         * @default 5
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
    return DotFilter;
}(Filter));

export { DotFilter };
//# sourceMappingURL=filter-dot.esm.js.map
