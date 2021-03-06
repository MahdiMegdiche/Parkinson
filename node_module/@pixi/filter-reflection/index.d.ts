import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';

declare type Range_2 = number[] | Float32Array;

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-reflection|@pixi/filter-reflection}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class ReflectionFilter extends Filter {
    /** Default constructor options */
    static readonly defaults: ReflectionFilterOptions;
    /** Time for animating position of waves */
    time: number;
    /**
     * @param {object} [options] - The optional parameters of Reflection effect.
     * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
     * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
     *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
     * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
     * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
     * @param {number} [options.time=0] - Time for animating position of waves
     */
    constructor(options?: Partial<ReflectionFilterOptions>);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * `true` to reflect the image, `false` for waves-only
     *
     * @member {boolean}
     * @default true
     */
    set mirror(value: boolean);
    get mirror(): boolean;
    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     *
     * @member {number}
     * @default 0.5
     */
    set boundary(value: number);
    get boundary(): number;
    /**
     * Starting and ending amplitude of waves
     * @member {number[]}
     * @default [0, 20]
     */
    set amplitude(value: Range_2);
    get amplitude(): Range_2;
    /**
     * Starting and ending length of waves
     * @member {number[]}
     * @default [30, 100]
     */
    set waveLength(value: Range_2);
    get waveLength(): Range_2;
    /**
     * Starting and ending alpha values
     * @member {number[]}
     * @default [1, 1]
     */
    set alpha(value: Range_2);
    get alpha(): Range_2;
}

export declare interface ReflectionFilterOptions {
    mirror: boolean;
    boundary: number;
    amplitude: Range_2;
    waveLength: Range_2;
    alpha: Range_2;
    time: number;
}

export { }
