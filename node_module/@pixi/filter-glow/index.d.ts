import { Filter } from '@pixi/core';

/**
 * GlowFilter, originally by mishaa
 * [codepen]{@link http://codepen.io/mishaa/pen/raKzrm}.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glow|@pixi/filter-glow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter({ distance: 15, outerStrength: 2 })
 *  ];
 */
export declare class GlowFilter extends Filter {
    /** Default values for options. */
    static readonly defaults: GlowFilterOptions;
    /**
     * @param {number} [options] - Options for glow.
     * @param {number} [options.distance=10] - The distance of the glow. Make it 2 times more for resolution=2.
     *        It can't be changed after filter creation.
     * @param {number} [options.outerStrength=4] - The strength of the glow outward from the edge of the sprite.
     * @param {number} [options.innerStrength=0] - The strength of the glow inward from the edge of the sprite.
     * @param {number} [options.color=0xffffff] - The color of the glow.
     * @param {number} [options.quality=0.1] - A number between 0 and 1 that describes the quality of the glow.
     *        The higher the number the less performant.
     * @param {boolean} [options.knockout=false] - Toggle to hide the contents and only show glow.
     */
    constructor(options?: Partial<GlowFilterOptions>);
    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    get color(): number;
    set color(value: number);
    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    get outerStrength(): number;
    set outerStrength(value: number);
    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    get innerStrength(): number;
    set innerStrength(value: number);
    /**
     * Only draw the glow, not the texture itself
     * @member {boolean}
     * @default false
     */
    get knockout(): boolean;
    set knockout(value: boolean);
}

export declare interface GlowFilterOptions {
    distance: number;
    outerStrength: number;
    innerStrength: number;
    color: number;
    quality: number;
    knockout: boolean;
}

export { }
