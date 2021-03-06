import { Filter } from '@pixi/core';

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-dot|@pixi/filter-dot}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class DotFilter extends Filter {
    /**
     * @param {number} [scale=1] - The scale of the effect.
     * @param {number} [angle=5] - The radius of the effect.
     */
    constructor(scale?: number, angle?: number);
    /**
     * The scale of the effect.
     * @member {number}
     * @default 1
     */
    get scale(): number;
    set scale(value: number);
    /**
     * The radius of the effect.
     * @member {number}
     * @default 5
     */
    get angle(): number;
    set angle(value: number);
}

export { }
