import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/old-film.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-old-film|@pixi/filter-old-film}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class OldFilmFilter extends Filter {
    /** Default constructor options */
    static readonly defaults: OldFilmFilterOptions;
    /** A see value to apply to the random noise generation */
    seed: number;
    /**
     * @param {object|number} [options] - The optional parameters of old film effect.
     *                        When options is a number , it will be `seed`
     * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
     *        a value of `1` is more saturation and closer to `0` is less, and a value of
     *        `0` produces no sepia effect
     * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
     * @param {number} [options.noiseSize=1.0] - The size of the noise particles
     * @param {number} [options.scratch=0.5] - How often scratches appear
     * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
     * @param {number} [options.scratchWidth=1.0] - The width of the scratches
     * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
     *        values produces a smaller vignette
     * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
     * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
     * @param {number} [seed=0] - A see value to apply to the random noise generation
     */
    constructor(options?: Partial<OldFilmFilterOptions>, seed?: number);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less,
     * and a value of `0` produces no sepia effect
     *
     * @member {number}
     * @default 0
     */
    set sepia(value: number);
    get sepia(): number;
    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     *
     * @member {number}
     * @default 0
     */
    set noise(value: number);
    get noise(): number;
    /**
     * The size of the noise particles
     *
     * @member {number}
     * @default 0
     */
    set noiseSize(value: number);
    get noiseSize(): number;
    /**
     * How often scratches appear
     *
     * @member {number}
     * @default 0
     */
    set scratch(value: number);
    get scratch(): number;
    /**
     * The density of the number of scratches
     *
     * @member {number}
     * @default 0
     */
    set scratchDensity(value: number);
    get scratchDensity(): number;
    /**
     * The width of the scratches
     *
     * @member {number}
     * @default 0
     */
    set scratchWidth(value: number);
    get scratchWidth(): number;
    /**
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
     *
     * @member {number}
     * @default 0
     */
    set vignetting(value: number);
    get vignetting(): number;
    /**
     * Amount of opacity of vignette
     *
     * @member {number}
     * @default 0
     */
    set vignettingAlpha(value: number);
    get vignettingAlpha(): number;
    /**
     * Blur intensity of the vignette
     *
     * @member {number}
     * @default 0
     */
    set vignettingBlur(value: number);
    get vignettingBlur(): number;
}

export declare interface OldFilmFilterOptions {
    sepia: number;
    noise: number;
    noiseSize: number;
    scratch: number;
    scratchDensity: number;
    scratchWidth: number;
    vignetting: number;
    vignettingAlpha: number;
    vignettingBlur: number;
}

export { }
