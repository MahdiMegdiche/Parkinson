import { Filter } from '@pixi/core';
import { Point } from '@pixi/math';

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-twist|@pixi/filter-twist}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class TwistFilter extends Filter {
    /** Default constructor options. */
    static readonly defaults: TwistFilterOptions;
    /**
     * @param {object} [options] - Object object to use.
     * @param {number} [options.radius=200] - The radius of the twist.
     * @param {number} [options.angle=4] - The angle of the twist.
     * @param {number} [options.padding=20] - Padding for filter area.
     * @param {number} [options.offset] - Center of twist, in local, pixel coordinates.
     */
    constructor(options?: Partial<TwistFilterOptions>);
    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     */
    get offset(): Point;
    set offset(value: Point);
    /**
     * The radius of the twist.
     *
     * @member {number}
     */
    get radius(): number;
    set radius(value: number);
    /**
     * The angle of the twist.
     *
     * @member {number}
     */
    get angle(): number;
    set angle(value: number);
}

export declare interface TwistFilterOptions {
    radius: number;
    angle: number;
    padding: number;
    offset: Point;
}

export { }
