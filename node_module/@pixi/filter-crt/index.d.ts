import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-crt|@pixi/filter-crt}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class CRTFilter extends Filter {
    /** Default constructor options */
    static readonly defaults: CRTFilterOptions;
    /** For animating interlaced lines */
    time: number;
    /** A seed value to apply to the random noise generation */
    seed: number;
    /**
     * @param {object} [options] - The optional parameters of CRT effect
     * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
     * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
     * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
     * @param {number} [options.verticalLine=false] - `true` is vertical lines, `false` is horizontal
     * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
     * @param {number} [options.noiseSize=1.0] - The size of the noise particles
     * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
     * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
     *        values produces a smaller vignette
     * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
     * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
     * @param {number} [options.time=0] - For animating interlaced lines
     */
    constructor(options?: Partial<CRTFilterOptions>);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Bent of interlaced lines, higher value means more bend
     *
     * @member {number}
     * @default 1
     */
    set curvature(value: number);
    get curvature(): number;
    /**
     * Width of interlaced lines
     *
     * @member {number}
     * @default 1
     */
    set lineWidth(value: number);
    get lineWidth(): number;
    /**
     * Contrast of interlaced lines
     *
     * @member {number}
     * @default 0.25
     */
    set lineContrast(value: number);
    get lineContrast(): number;
    /**
     * `true` for vertical lines, `false` for horizontal lines
     *
     * @member {boolean}
     * @default false
     */
    set verticalLine(value: boolean);
    get verticalLine(): boolean;
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

export declare interface CRTFilterOptions {
    curvature: number;
    lineWidth: number;
    lineContrast: number;
    verticalLine: boolean;
    noise: number;
    noiseSize: number;
    seed: number;
    vignetting: number;
    vignettingAlpha: number;
    vignettingBlur: number;
    time: number;
}

export { }
