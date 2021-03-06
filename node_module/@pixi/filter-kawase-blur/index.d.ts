import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { IPoint } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-kawase-blur|@pixi/filter-kawase-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class KawaseBlurFilter extends Filter {
    private _pixelSize;
    private _clamp;
    private _kernels;
    private _blur;
    private _quality;
    /**
     * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
     *        value is an Array, setting kernels.
     * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
     * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
     *        from fullscreen filters or bleeding to the edge of filterArea.
     */
    constructor(blur?: number | number[], quality?: number, clamp?: boolean);
    /**
     * Overrides apply
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    private _updatePadding;
    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    private _generateKernels;
    /**
     * The kernel size of the blur filter, for advanced usage.
     *
     * @member {number[]}
     * @default [0]
     */
    get kernels(): number[];
    set kernels(value: number[]);
    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @member {boolean}
     * @default false
     */
    get clamp(): boolean;
    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    set pixelSize(value: PixelSizeValue);
    get pixelSize(): PixelSizeValue;
    /**
     * The quality of the filter, integer greater than `1`.
     *
     * @member {number}
     * @default 3
     */
    get quality(): number;
    set quality(value: number);
    /**
     * The amount of blur, value greater than `0`.
     *
     * @member {number}
     * @default 4
     */
    get blur(): number;
    set blur(value: number);
}

export declare type PixelSizeValue = IPoint | number[] | number;

export { }
