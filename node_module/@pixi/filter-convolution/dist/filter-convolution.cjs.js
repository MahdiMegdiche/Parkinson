/*!
 * @pixi/filter-convolution - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-convolution is licensed under the MIT License.
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

var fragment = "precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n";

/**
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce a new image.
 * A wide variety of image effects can be achieved through convolutions, including blurring, edge
 * detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array.
 * See https://docs.gimp.org/2.10/en/gimp-filter-convolution-matrix.html for more info.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/convolution.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-convolution|@pixi/filter-convolution}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var ConvolutionFilter = /** @class */ (function (_super) {
    __extends(ConvolutionFilter, _super);
    /**
     * @param {number[]} [matrix=[0,0,0,0,0,0,0,0,0]] - An array of values used for matrix transformation.
     *        Specified as a 9 point Array.
     * @param {number} [width=200] - Width of the object you are transforming
     * @param {number} [height=200] - Height of the object you are transforming
     */
    function ConvolutionFilter(matrix, width, height) {
        if (width === void 0) { width = 200; }
        if (height === void 0) { height = 200; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.uniforms.texelSize = new Float32Array(2);
        _this.uniforms.matrix = new Float32Array(9);
        if (matrix !== undefined) {
            _this.matrix = matrix;
        }
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Object.defineProperty(ConvolutionFilter.prototype, "matrix", {
        /**
         * An array of values used for matrix transformation. Specified as a 9 point Array.
         *
         * @member {Array<number>}
         */
        get: function () {
            return this.uniforms.matrix;
        },
        set: function (matrix) {
            var _this = this;
            matrix.forEach(function (v, i) {
                _this.uniforms.matrix[i] = v;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConvolutionFilter.prototype, "width", {
        /**
         * Width of the object you are transforming
         *
         * @member {number}
         */
        get: function () {
            return 1 / this.uniforms.texelSize[0];
        },
        set: function (value) {
            this.uniforms.texelSize[0] = 1 / value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConvolutionFilter.prototype, "height", {
        /**
         * Height of the object you are transforming
         *
         * @member {number}
         */
        get: function () {
            return 1 / this.uniforms.texelSize[1];
        },
        set: function (value) {
            this.uniforms.texelSize[1] = 1 / value;
        },
        enumerable: false,
        configurable: true
    });
    return ConvolutionFilter;
}(core.Filter));

exports.ConvolutionFilter = ConvolutionFilter;
//# sourceMappingURL=filter-convolution.cjs.js.map
