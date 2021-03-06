import { Filter } from '@pixi/core';

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-ascii|@pixi/filter-ascii}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class AsciiFilter extends Filter {
    /**
     * @param {number} [size=8] - Size of the font
     */
    constructor(size?: number);
    /**
     * The pixel size used by the filter.
     *
     * @member {number}
     */
    get size(): number;
    set size(value: number);
}

export { }
