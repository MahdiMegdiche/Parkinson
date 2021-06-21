import { Filter } from '@pixi/core';

declare type Color = number | number[] | Float32Array;

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-replace.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
 *
 */
export declare class ColorReplaceFilter extends Filter {
    private _originalColor;
    private _newColor;
    /**
     * @param {number|Array<number>|Float32Array} [originalColor=0xFF0000] - The color that will be changed,
     *        as a 3 component RGB e.g. `[1.0, 1.0, 1.0]`
     * @param {number|Array<number>|Float32Array} [newColor=0x000000] - The resulting color, as a 3 component
     *        RGB e.g. `[1.0, 0.5, 1.0]`
     * @param {number} [epsilon=0.4] - Tolerance/sensitivity of the floating-point comparison between colors
     *        (lower = more exact, higher = more inclusive)
     */
    constructor(originalColor?: Color, newColor?: Color, epsilon?: number);
    /**
     * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
     * @member {number|Array<number>|Float32Array}
     * @default 0xFF0000
     */
    set originalColor(value: Color);
    get originalColor(): Color;
    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>|Float32Array}
     * @default 0x000000
     */
    set newColor(value: Color);
    get newColor(): Color;
    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @member {number}
     * @default 0.4
     */
    set epsilon(value: number);
    get epsilon(): number;
}

export { }