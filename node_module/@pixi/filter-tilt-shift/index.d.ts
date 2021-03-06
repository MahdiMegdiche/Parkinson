import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import { FilterSystem } from '@pixi/core';
import { Point } from '@pixi/math';
import { RenderTexture } from '@pixi/core';

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @private
 */
export declare class TiltShiftAxisFilter extends Filter {
    constructor(blur?: number, gradientBlur?: number, start?: Point, end?: Point);
    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    protected updateDelta(): void;
    /**
     * The strength of the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get blur(): number;
    set blur(value: number);
    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get gradientBlur(): number;
    set gradientBlur(value: number);
    /**
     * The X value to start the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get start(): Point;
    set start(value: Point);
    /**
     * The X value to end the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get end(): Point;
    set end(value: Point);
}

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/tilt-shift.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-tilt-shift|@pixi/filter-tilt-shift}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class TiltShiftFilter extends Filter {
    private tiltShiftXFilter;
    private tiltShiftYFilter;
    /**
     * @param {number} [blur=100] - The strength of the blur.
     * @param {number} [gradientBlur=600] - The strength of the gradient blur.
     * @param {PIXI.Point} [start=null] - The Y value to start the effect at.
     * @param {PIXI.Point} [end=null] - The Y value to end the effect at.
     */
    constructor(blur?: number, gradientBlur?: number, start?: Point, end?: Point);
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    get blur(): number;
    set blur(value: number);
    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     */
    get gradientBlur(): number;
    set gradientBlur(value: number);
    /**
     * The Y value to start the effect at.
     *
     * @member {PIXI.Point}
     */
    get start(): Point;
    set start(value: Point);
    /**
     * The Y value to end the effect at.
     *
     * @member {PIXI.Point}
     */
    get end(): Point;
    set end(value: Point);
}

/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
export declare class TiltShiftXFilter extends TiltShiftAxisFilter {
    /**
     * Updates the filter delta values.
     */
    protected updateDelta(): void;
}

/**
 * A TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
export declare class TiltShiftYFilter extends TiltShiftAxisFilter {
    /**
     * Updates the filter delta values.
     */
    protected updateDelta(): void;
}

export { }
