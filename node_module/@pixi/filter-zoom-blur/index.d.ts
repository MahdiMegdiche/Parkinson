import { Filter } from '@pixi/core';
import { Point } from '@pixi/math';

declare type PointLike = Point | number[];

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-zoom-blur|@pixi/filter-zoom-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class ZoomBlurFilter extends Filter {
    /** Default constructor options. */
    static readonly defaults: ZoomBlurFilterOptions;
    /**
     * @param {object} [options] - Filter options to use.
     * @param {number} [options.strength=0.1] - Sets the strength of the zoom blur effect
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - The center of the zoom.
     * @param {number} [options.innerRadius=0] - The inner radius of zoom. The part in inner circle won't apply
     *        zoom blur effect.
     * @param {number} [options.radius=-1] - See `radius` property.
     * @param {number} [options.maxKernelSize=32] - On older iOS devices, it's better to not go above `13.0`.
     *        Decreasing this value will produce a lower-quality blur effect with more dithering.
     */
    constructor(options?: Partial<ZoomBlurFilterOptions>);
    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    get center(): PointLike;
    set center(value: PointLike);
    /**
     * Intensity of the zoom effect.
     *
     * @member {number}
     * @default 0.1
     */
    get strength(): number;
    set strength(value: number);
    /**
     * Radius of the inner region not effected by blur.
     *
     * @member {number}
     * @default 0
     */
    get innerRadius(): number;
    set innerRadius(value: number);
    /**
     * Outer radius of the effect. The default value is `-1`.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     * @default -1
     */
    get radius(): number;
    set radius(value: number);
}

export declare interface ZoomBlurFilterOptions {
    strength: number;
    center: PointLike;
    innerRadius: number;
    radius: number;
    maxKernelSize: number;
}

export { }
