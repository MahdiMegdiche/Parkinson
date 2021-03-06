import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import { Point } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

/**
 * GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
 *
 *
 *
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-godray|@pixi/filter-godray}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  displayObject.filters = [new GodrayFilter()];
 */
export declare class GodrayFilter extends Filter {
    /** Default for constructior options. */
    static readonly defaults: GodrayFilterOptions;
    /**
     * `true` if light rays are parallel (uses angle),
     * `false` to use the focal `center` point
     */
    parallel: boolean;
    /**
     * The position of the emitting point for light rays
     * only used if `parallel` is set to `false`.
     */
    center: number[] | Point;
    /** The current time. */
    time: number;
    private _angleLight;
    private _angle;
    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.angle=30] - Angle/Light-source of the rays.
     * @param {number} [options.gain=0.5] - General intensity of the effect.
     * @param {number} [options.lacunarity=2.5] - The density of the fractal noise.
     * @param {boolean} [options.parallel=true] - `true` to use `angle`, `false` to use `center`
     * @param {number} [options.time=0] - The current time position.
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - Focal point for non-parallel rays,
     *        to use this `parallel` must be set to `false`.
 * @param {number} [options.alpha=1.0] - the alpha, defaults to 1, affects transparency of rays
     */
    constructor(options?: Partial<GodrayFilterOptions>);
    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
     *     values of 90 or -90 produce horizontal rays.
     * @member {number}
     * @default 30
     */
    get angle(): number;
    set angle(value: number);
    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect.
     *
     * @member {number}
     * @default 0.5
     */
    get gain(): number;
    set gain(value: number);
    /**
     * The density of the fractal noise. A higher amount produces more rays and a smaller amound
     * produces fewer waves.
     *
     * @member {number}
     * @default 2.5
     */
    get lacunarity(): number;
    set lacunarity(value: number);
    /**
     * The alpha (opacity) of the rays.  0 is fully transparent, 1 is fully opaque
     * @member {number}
     * @default 1
     */
    get alpha(): number;
    set alpha(value: number);
}

declare interface GodrayFilterOptions {
    angle: number;
    gain: number;
    lacunarity: number;
    parallel: boolean;
    time: number;
    center: number[] | Point;
    alpha: number;
}

export { }
