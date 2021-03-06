import { Filter } from '@pixi/core';

declare type Color = number | number[] | Float32Array;

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-multi-color-replace|@pixi/filter-multi-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    0.001
 *  )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    0.001
 *  )];
 *
 */
export declare class MultiColorReplaceFilter extends Filter {
    private _replacements;
    private _maxColors;
    /**
     * @param {Array<Array>} replacements - The collection of replacement items. Each item is color-pair
     *        (an array length is 2). In the pair, the first value is original color , the second value
     *        is target color.
     * @param {number} [epsilon=0.05] - Tolerance of the floating-point comparison between colors
     *        (lower = more exact, higher = more inclusive)
     * @param {number} [maxColors] - The maximum number of replacements filter is able to use. Because the
     *        fragment is only compiled once, this cannot be changed after construction.
     *        If omitted, the default value is the length of `replacements`.
     */
    constructor(replacements: Array<[Color, Color]>, epsilon?: number, maxColors?: number);
    /**
     * The source and target colors for replacement. See constructor for information on the format.
     *
     * @member {Array<Array>}
     */
    set replacements(replacements: Array<[Color, Color]>);
    get replacements(): Array<[Color, Color]>;
    /**
     * Should be called after changing any of the contents of the replacements.
     * This is a convenience method for resetting the `replacements`.
     */
    refresh(): void;
    /**
     * The maximum number of color replacements supported by this filter. Can be changed
     * _only_ during construction.
     *
     * @member {number}
     * @readonly
     */
    get maxColors(): number;
    /**
     * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     *
     * @member {number}
     * @default 0.05
     */
    set epsilon(value: number);
    get epsilon(): number;
}

export { }
