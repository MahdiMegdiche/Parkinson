import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterState } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { PixelSizeValue } from '@pixi/filter-kawase-blur';
import type { RenderTexture } from '@pixi/core';

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-advanced-bloom|@pixi/filter-advanced-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class AdvancedBloomFilter extends Filter {
    /** Default construction options. */
    static readonly defaults: AdvancedBloomFilterOptions;
    /** To adjust the strength of the bloom. Higher values is more intense brightness. */
    bloomScale: number;
    /** The brightness, lower value is more subtle brightness, higher value is blown-out. */
    brightness: number;
    private _extractFilter;
    private _blurFilter;
    private _resolution;
    /**
     * @param {object|number} [options] - The optional parameters of advanced bloom filter.
     *                        When options is a number , it will be `options.threshold`.
     * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
     * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is
     *        more intense brightness.
     * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness,
     *        higher value is blown-out.
     * @param {number} [options.blur=8] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=4] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<AdvancedBloomFilterOptions>);
    /**
     * Override existing apply method in PIXI.Filter
     *
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES, currentState?: FilterState): void;
    /**
     * The resolution of the filter.
     * @ignore
     */
    get resolution(): number;
    set resolution(value: number);
    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold(): number;
    set threshold(value: number);
    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
     */
    get kernels(): number[];
    set kernels(value: number[]);
    /**
     * Sets the strength of the Blur properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality(): number;
    set quality(value: number);
    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize(): PixelSizeValue;
    set pixelSize(value: PixelSizeValue);
}

export declare interface AdvancedBloomFilterOptions {
    threshold: number;
    bloomScale: number;
    brightness: number;
    kernels: number[] | null;
    blur: number;
    quality: number;
    pixelSize: PixelSizeValue;
    resolution: number;
}

export { }
