import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import { Point } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

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
export declare class BloomFilter extends Filter {
    private blurXFilter;
    private blurYFilter;
    private defaultFilter;
    /**
    * @param {number|PIXI.Point|number[]} [blur=2] - Sets the strength of both the blurX and blurY properties simultaneously
    * @param {number} [quality=4] - The quality of the blurX & blurY filter.
    * @param {number} [resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the blurX & blurY filter.
    * @param {number} [kernelSize=5] - The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
    */
    constructor(blur?: BlurValue, quality?: number, resolution?: number, kernelSize?: number);
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 2
     */
    get blurX(): number;
    set blurX(value: number);
    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 2
     */
    get blurY(): number;
    set blurY(value: number);
}

declare type BlurValue = number | Point | number[];

export { }
