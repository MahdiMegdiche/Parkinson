import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { IPoint } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';
import { Texture } from '@pixi/core';

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
export declare class GlitchFilter extends Filter {
    /** Default constructor options. */
    static readonly defaults: GlitchFilterOptions;
    /** Fill mode as transparent */
    static readonly TRANSPARENT = 0;
    /** Fill mode as original */
    static readonly ORIGINAL = 1;
    /** Fill mode as loop */
    static readonly LOOP = 2;
    /** Fill mode as clamp */
    static readonly CLAMP = 3;
    /** Fill mode as mirror */
    static readonly MIRROR = 4;
    /** The maximum offset value for each of the slices. */
    offset: number;
    /** The fill mode of the space after the offset. */
    fillMode: number;
    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     */
    average: boolean;
    /**
     * A seed value for randomizing color offset. Animating
     * this value to `Math.random()` produces a twitching effect.
     */
    seed: number;
    /** Minimum size of slices as a portion of the `sampleSize` */
    minSize: number;
    /** Height of the displacement map canvas. */
    sampleSize: number;
    /** Internally generated canvas. */
    private _canvas;
    /**
     * The displacement map is used to generate the bands.
     * If using your own texture, `slices` will be ignored.
     *
     * @member {PIXI.Texture}
     * @readonly
     */
    texture: Texture;
    /** Internal number of slices */
    private _slices;
    private _offsets;
    private _sizes;
    private _direction;
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
    constructor(options?: Partial<GlitchFilterOptions>);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    private _randomizeSizes;
    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    shuffle(): void;
    /**
     * Randomize the values for offset from -1 to 1
     *
     * @private
     */
    private _randomizeOffsets;
    /**
     * Regenerating random size, offsets for slices.
     */
    refresh(): void;
    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    redraw(): void;
    /**
     * Manually custom slices size (height) of displacement bitmap
     *
     * @member {number[]|Float32Array}
     */
    set sizes(sizes: Float32Array);
    get sizes(): Float32Array;
    /**
     * Manually set custom slices offset of displacement bitmap, this is
     * a collection of values from -1 to 1. To change the max offset value
     * set `offset`.
     *
     * @member {number[]|Float32Array}
     */
    set offsets(offsets: Float32Array);
    get offsets(): Float32Array;
    /**
     * The count of slices.
     * @member {number}
     * @default 5
     */
    get slices(): number;
    set slices(value: number);
    /**
     * The angle in degree of the offset of slices.
     * @member {number}
     * @default 0
     */
    get direction(): number;
    set direction(value: number);
    /**
     * Red channel offset.
     *
     * @member {PIXI.Point|number[]}
     */
    get red(): PointLike;
    set red(value: PointLike);
    /**
     * Green channel offset.
     *
     * @member {PIXI.Point|number[]}
     */
    get green(): PointLike;
    set green(value: PointLike);
    /**
     * Blue offset.
     *
     * @member {PIXI.Point|number[]}
     */
    get blue(): PointLike;
    set blue(value: PointLike);
    /**
     * Removes all references
     */
    destroy(): void;
}

export declare interface GlitchFilterOptions {
    slices: number;
    offset: number;
    direction: number;
    fillMode: number;
    seed: number;
    average: boolean;
    minSize: number;
    sampleSize: number;
    red: PointLike;
    green: PointLike;
    blue: PointLike;
}

declare type PointLike = IPoint | number[];

export { }
