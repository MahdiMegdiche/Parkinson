import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { Point } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

declare type PointLike = Point | number[];

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/radial-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-radial-blur|@pixi/filter-radial-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class RadialBlurFilter extends Filter {
    private _angle;
    /**
     * The kernelSize for the blur filter. Must be odd number >= 3.
     * @member {number}
     * @default 5
     */
    kernelSize: number;
    /**
     * @param {number} [angle=0] - Sets the angle of the motion for blur effect.
     * @param {PIXI.Point|number[]} [center=[0,0]] - The center of the radial.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 3
     * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
     */
    constructor(angle?: number, center?: PointLike, kernelSize?: number, radius?: number);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Sets the angle in degrees of the motion for blur effect.
     *
     * @member {PIXI.Point|number[]}
     * @default 0
     */
    set angle(value: number);
    get angle(): number;
    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    get center(): PointLike;
    set center(value: PointLike);
    /**
     * Outer radius of the effect. The default value of `-1` is infinite.
     *
     * @member {number}
     * @default -1
     */
    get radius(): number;
    set radius(value: number);
}

export { }
