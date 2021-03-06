/*!
 * @pixi/filter-glitch - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-glitch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Texture, Filter } from '@pixi/core';
import { SCALE_MODES } from '@pixi/constants';
import { DEG_TO_RAD } from '@pixi/math';

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

var fragment = "// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n";

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glitch|@pixi/filter-glitch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var GlitchFilter = /** @class */ (function (_super) {
    __extends(GlitchFilter, _super);
    /**
     * @param {object} [options] - The more optional parameters of the filter.
     * @param {number} [options.slices=5] - The maximum number of slices.
     * @param {number} [options.offset=100] - The maximum offset amount of slices.
     * @param {number} [options.direction=0] - The angle in degree of the offset of slices.
     * @param {number} [options.fillMode=0] - The fill mode of the space after the offset. Acceptable values:
     *  - `0` {@link PIXI.filters.GlitchFilter.TRANSPARENT TRANSPARENT}
     *  - `1` {@link PIXI.filters.GlitchFilter.ORIGINAL ORIGINAL}
     *  - `2` {@link PIXI.filters.GlitchFilter.LOOP LOOP}
     *  - `3` {@link PIXI.filters.GlitchFilter.CLAMP CLAMP}
     *  - `4` {@link PIXI.filters.GlitchFilter.MIRROR MIRROR}
     * @param {number} [options.seed=0] - A seed value for randomizing glitch effect.
     * @param {boolean} [options.average=false] - `true` will divide the bands roughly based on equal amounts
     *                 where as setting to `false` will vary the band sizes dramatically (more random looking).
     * @param {number} [options.minSize=8] - Minimum size of individual slice. Segment of total `sampleSize`
     * @param {number} [options.sampleSize=512] - The resolution of the displacement map texture.
     * @param {number[]} [options.red=[0,0]] - Red channel offset
     * @param {number[]} [options.green=[0,0]] - Green channel offset.
     * @param {number[]} [options.blue=[0,0]] - Blue channel offset.
     */
    function GlitchFilter(options) {
        var _this = _super.call(this, vertex, fragment) || this;
        /** The maximum offset value for each of the slices. */
        _this.offset = 100;
        /** The fill mode of the space after the offset. */
        _this.fillMode = GlitchFilter.TRANSPARENT;
        /**
         * `true` will divide the bands roughly based on equal amounts
         * where as setting to `false` will vary the band sizes dramatically (more random looking).
         */
        _this.average = false;
        /**
         * A seed value for randomizing color offset. Animating
         * this value to `Math.random()` produces a twitching effect.
         */
        _this.seed = 0;
        /** Minimum size of slices as a portion of the `sampleSize` */
        _this.minSize = 8;
        /** Height of the displacement map canvas. */
        _this.sampleSize = 512;
        /** Internal number of slices */
        _this._slices = 0;
        _this._offsets = new Float32Array(1);
        _this._sizes = new Float32Array(1);
        _this._direction = 0;
        _this.uniforms.dimensions = new Float32Array(2);
        _this._canvas = document.createElement('canvas');
        _this._canvas.width = 4;
        _this._canvas.height = _this.sampleSize;
        _this.texture = Texture.from(_this._canvas, { scaleMode: SCALE_MODES.NEAREST });
        Object.assign(_this, GlitchFilter.defaults, options);
        return _this;
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    GlitchFilter.prototype.apply = function (filterManager, input, output, clear) {
        var _a = input.filterFrame, width = _a.width, height = _a.height;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.fillMode = this.fillMode;
        filterManager.applyFilter(this, input, output, clear);
    };
    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    GlitchFilter.prototype._randomizeSizes = function () {
        var arr = this._sizes;
        var last = this._slices - 1;
        var size = this.sampleSize;
        var min = Math.min(this.minSize / size, 0.9 / this._slices);
        if (this.average) {
            var count = this._slices;
            var rest = 1;
            for (var i = 0; i < last; i++) {
                var averageWidth = rest / (count - i);
                var w = Math.max(averageWidth * (1 - (Math.random() * 0.6)), min);
                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        else {
            var rest = 1;
            var ratio = Math.sqrt(1 / this._slices);
            for (var i = 0; i < last; i++) {
                var w = Math.max(ratio * rest * Math.random(), min);
                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        this.shuffle();
    };
    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    GlitchFilter.prototype.shuffle = function () {
        var arr = this._sizes;
        var last = this._slices - 1;
        // shuffle
        for (var i = last; i > 0; i--) {
            var rand = (Math.random() * i) >> 0;
            var temp = arr[i];
            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    };
    /**
     * Randomize the values for offset from -1 to 1
     *
     * @private
     */
    GlitchFilter.prototype._randomizeOffsets = function () {
        for (var i = 0; i < this._slices; i++) {
            this._offsets[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    };
    /**
     * Regenerating random size, offsets for slices.
     */
    GlitchFilter.prototype.refresh = function () {
        this._randomizeSizes();
        this._randomizeOffsets();
        this.redraw();
    };
    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    GlitchFilter.prototype.redraw = function () {
        var size = this.sampleSize;
        var texture = this.texture;
        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, 8, size);
        var offset;
        var y = 0;
        for (var i = 0; i < this._slices; i++) {
            offset = Math.floor(this._offsets[i] * 256);
            var height = this._sizes[i] * size;
            var red = offset > 0 ? offset : 0;
            var green = offset < 0 ? -offset : 0;
            ctx.fillStyle = "rgba(" + red + ", " + green + ", 0, 1)";
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }
        texture.baseTexture.update();
        this.uniforms.displacementMap = texture;
    };
    Object.defineProperty(GlitchFilter.prototype, "sizes", {
        get: function () {
            return this._sizes;
        },
        /**
         * Manually custom slices size (height) of displacement bitmap
         *
         * @member {number[]|Float32Array}
         */
        set: function (sizes) {
            var len = Math.min(this._slices, sizes.length);
            for (var i = 0; i < len; i++) {
                this._sizes[i] = sizes[i];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "offsets", {
        get: function () {
            return this._offsets;
        },
        /**
         * Manually set custom slices offset of displacement bitmap, this is
         * a collection of values from -1 to 1. To change the max offset value
         * set `offset`.
         *
         * @member {number[]|Float32Array}
         */
        set: function (offsets) {
            var len = Math.min(this._slices, offsets.length);
            for (var i = 0; i < len; i++) {
                this._offsets[i] = offsets[i];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "slices", {
        /**
         * The count of slices.
         * @member {number}
         * @default 5
         */
        get: function () {
            return this._slices;
        },
        set: function (value) {
            if (this._slices === value) {
                return;
            }
            this._slices = value;
            this.uniforms.slices = value;
            this._sizes = this.uniforms.slicesWidth = new Float32Array(value);
            this._offsets = this.uniforms.slicesOffset = new Float32Array(value);
            this.refresh();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "direction", {
        /**
         * The angle in degree of the offset of slices.
         * @member {number}
         * @default 0
         */
        get: function () {
            return this._direction;
        },
        set: function (value) {
            if (this._direction === value) {
                return;
            }
            this._direction = value;
            var radians = value * DEG_TO_RAD;
            this.uniforms.sinDir = Math.sin(radians);
            this.uniforms.cosDir = Math.cos(radians);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "red", {
        /**
         * Red channel offset.
         *
         * @member {PIXI.Point|number[]}
         */
        get: function () {
            return this.uniforms.red;
        },
        set: function (value) {
            this.uniforms.red = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "green", {
        /**
         * Green channel offset.
         *
         * @member {PIXI.Point|number[]}
         */
        get: function () {
            return this.uniforms.green;
        },
        set: function (value) {
            this.uniforms.green = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlitchFilter.prototype, "blue", {
        /**
         * Blue offset.
         *
         * @member {PIXI.Point|number[]}
         */
        get: function () {
            return this.uniforms.blue;
        },
        set: function (value) {
            this.uniforms.blue = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Removes all references
     */
    GlitchFilter.prototype.destroy = function () {
        var _a;
        (_a = this.texture) === null || _a === void 0 ? void 0 : _a.destroy(true);
        this.texture
            = this._canvas
                = this.red
                    = this.green
                        = this.blue
                            = this._sizes
                                = this._offsets = null;
    };
    /** Default constructor options. */
    GlitchFilter.defaults = {
        slices: 5,
        offset: 100,
        direction: 0,
        fillMode: 0,
        average: false,
        seed: 0,
        red: [0, 0],
        green: [0, 0],
        blue: [0, 0],
        minSize: 8,
        sampleSize: 512,
    };
    /** Fill mode as transparent */
    GlitchFilter.TRANSPARENT = 0;
    /** Fill mode as original */
    GlitchFilter.ORIGINAL = 1;
    /** Fill mode as loop */
    GlitchFilter.LOOP = 2;
    /** Fill mode as clamp */
    GlitchFilter.CLAMP = 3;
    /** Fill mode as mirror */
    GlitchFilter.MIRROR = 4;
    return GlitchFilter;
}(Filter));

export { GlitchFilter };
//# sourceMappingURL=filter-glitch.esm.js.map
