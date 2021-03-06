/*!
 * @pixi/filter-simple-lightmap - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-simple-lightmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@pixi/core');
var utils = require('@pixi/utils');

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

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n";

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/simple-lightmap.png)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @see {@link https://www.npmjs.com/package/@pixi/filter-simple-lightmap|@pixi/filter-simple-lightmap}
* @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
*
* @example
*  displayObject.filters = [new SimpleLightmapFilter(texture, 0x666666)];
*/
var SimpleLightmapFilter = /** @class */ (function (_super) {
    __extends(SimpleLightmapFilter, _super);
    /**
     * @param {PIXI.Texture} texture - a texture where your lightmap is rendered
     * @param {Array<number>|number} [color=0x000000] - An RGBA array of the ambient color
     * @param {number} [alpha=1] - Default alpha set independent of color (if it's a number, not array).
     */
    function SimpleLightmapFilter(texture, color, alpha) {
        if (color === void 0) { color = 0x000000; }
        if (alpha === void 0) { alpha = 1; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this._color = 0x0;
        _this.uniforms.dimensions = new Float32Array(2);
        _this.uniforms.ambientColor = new Float32Array([0, 0, 0, alpha]);
        _this.texture = texture;
        _this.color = color;
        return _this;
    }
    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    SimpleLightmapFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a, _b;
        this.uniforms.dimensions[0] = (_a = input.filterFrame) === null || _a === void 0 ? void 0 : _a.width;
        this.uniforms.dimensions[1] = (_b = input.filterFrame) === null || _b === void 0 ? void 0 : _b.height;
        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    };
    Object.defineProperty(SimpleLightmapFilter.prototype, "texture", {
        /**
         * a texture where your lightmap is rendered
         * @member {PIXI.Texture}
         */
        get: function () {
            return this.uniforms.uLightmap;
        },
        set: function (value) {
            this.uniforms.uLightmap = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleLightmapFilter.prototype, "color", {
        get: function () {
            return this._color;
        },
        /**
         * An RGBA array of the ambient color or a hex color without alpha
         * @member {Array<number>|number}
         */
        set: function (value) {
            var arr = this.uniforms.ambientColor;
            if (typeof value === 'number') {
                utils.hex2rgb(value, arr);
                this._color = value;
            }
            else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                arr[3] = value[3];
                this._color = utils.rgb2hex(arr);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleLightmapFilter.prototype, "alpha", {
        /**
         * When setting `color` as hex, this can be used to set alpha independently.
         * @member {number}
         */
        get: function () {
            return this.uniforms.ambientColor[3];
        },
        set: function (value) {
            this.uniforms.ambientColor[3] = value;
        },
        enumerable: false,
        configurable: true
    });
    return SimpleLightmapFilter;
}(core.Filter));

exports.SimpleLightmapFilter = SimpleLightmapFilter;
//# sourceMappingURL=filter-simple-lightmap.cjs.js.map
