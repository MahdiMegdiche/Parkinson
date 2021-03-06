import { Filter } from '@pixi/core';

declare type Color = number | number[] | Float32Array;

/**
 * Replace all colors within a source graphic with a single color.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-overlay.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces red with blue
 *  someSprite.filters = [new ColorOverlayFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *
 */
export declare class ColorOverlayFilter extends Filter {
    private _color;
    private _alpha;
    /**
     * @param {number|Array<number>} [color=0x000000] - The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @param {number} [alpha=1] - The alpha value of the color
     */
    constructor(color?: Color, alpha?: number);
    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>|Float32Array}
     * @default 0x000000
     */
    set color(value: Color);
    get color(): Color;
    /**
     * The alpha value of the color
     * @member {number}
     * @default 0
     */
    set alpha(value: number);
    get alpha(): number;
}

export { }
