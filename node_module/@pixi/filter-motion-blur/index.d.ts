import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { IPoint } from '@pixi/math';
import { ObservablePoint } from '@pixi/math';
import { Point } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-motion-blur|@pixi/filter-motion-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class MotionBlurFilter extends Filter {
    /**
     * The kernelSize of the blur, higher values are slower but look better.
     * Use odd value greater than 5.
     */
    kernelSize: number;
    private _velocity;
    /**
     * @param {PIXI.ObservablePoint|PIXI.Point|number[]} [velocity=[0, 0]] - Sets the velocity of the motion for blur effect.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 5
     * @param {number} [offset=0] - The offset of the blur filter.
     */
    constructor(velocity?: number[] | Point | ObservablePoint, kernelSize?: number, offset?: number);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Sets the velocity of the motion for blur effect.
     *
     * @member {PIXI.ObservablePoint|PIXI.Point|number[]}
     */
    set velocity(value: IPoint);
    get velocity(): IPoint;
    /**
     * Set velocity with more broad types
     */
    private setVelocity;
    /**
     * Handle velocity changed
     * @private
     */
    private velocityChanged;
    /**
     * The offset of the blur filter.
     *
     * @member {number}
     * @default 0
     */
    set offset(value: number);
    get offset(): number;
}

export { }
