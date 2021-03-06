/*!
 * @pixi/filter-bloom - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import { Filter } from '@pixi/core';
import { BLEND_MODES } from '@pixi/constants';
import { AlphaFilter } from '@pixi/filter-alpha';
import { BlurFilterPass } from '@pixi/filter-blur';
import { settings } from '@pixi/settings';
import { Point } from '@pixi/math';

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

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bloom|@pixi/filter-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var BloomFilter = /** @class */ (function (_super) {
    __extends(BloomFilter, _super);
    /**
    * @param {number|PIXI.Point|number[]} [blur=2] - Sets the strength of both the blurX and blurY properties simultaneously
    * @param {number} [quality=4] - The quality of the blurX & blurY filter.
    * @param {number} [resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the blurX & blurY filter.
    * @param {number} [kernelSize=5] - The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
    */
    function BloomFilter(blur, quality, resolution, kernelSize) {
        if (blur === void 0) { blur = 2; }
        if (quality === void 0) { quality = 4; }
        if (resolution === void 0) { resolution = settings.FILTER_RESOLUTION; }
        if (kernelSize === void 0) { kernelSize = 5; }
        var _this = _super.call(this) || this;
        var blurX;
        var blurY;
        if (typeof blur === 'number') {
            blurX = blur;
            blurY = blur;
        }
        else if (blur instanceof Point) {
            blurX = blur.x;
            blurY = blur.y;
        }
        else if (Array.isArray(blur)) {
            blurX = blur[0];
            blurY = blur[1];
        }
        _this.blurXFilter = new BlurFilterPass(true, blurX, quality, resolution, kernelSize);
        _this.blurYFilter = new BlurFilterPass(false, blurY, quality, resolution, kernelSize);
        _this.blurYFilter.blendMode = BLEND_MODES.SCREEN;
        _this.defaultFilter = new AlphaFilter();
        return _this;
    }
    BloomFilter.prototype.apply = function (filterManager, input, output, clear) {
        var renderTarget = filterManager.getFilterTexture();
        // TODO - copyTexSubImage2D could be used here?
        this.defaultFilter.apply(filterManager, input, output, clear);
        this.blurXFilter.apply(filterManager, input, renderTarget, 1);
        this.blurYFilter.apply(filterManager, renderTarget, output, 0);
        filterManager.returnFilterTexture(renderTarget);
    };
    Object.defineProperty(BloomFilter.prototype, "blur", {
        /**
         * Sets the strength of both the blurX and blurY properties simultaneously
         *
         * @member {number}
         * @default 2
         */
        get: function () {
            return this.blurXFilter.blur;
        },
        set: function (value) {
            this.blurXFilter.blur = this.blurYFilter.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BloomFilter.prototype, "blurX", {
        /**
         * Sets the strength of the blurX property
         *
         * @member {number}
         * @default 2
         */
        get: function () {
            return this.blurXFilter.blur;
        },
        set: function (value) {
            this.blurXFilter.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BloomFilter.prototype, "blurY", {
        /**
         * Sets the strength of the blurY property
         *
         * @member {number}
         * @default 2
         */
        get: function () {
            return this.blurYFilter.blur;
        },
        set: function (value) {
            this.blurYFilter.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    return BloomFilter;
}(Filter));

export { BloomFilter };
//# sourceMappingURL=filter-bloom.esm.js.map
