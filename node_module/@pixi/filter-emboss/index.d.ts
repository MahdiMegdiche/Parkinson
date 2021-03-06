import { Filter } from '@pixi/core';

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-emboss|@pixi/filter-emboss}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class EmbossFilter extends Filter {
    /**
     * @param {number} [strength=5] - Strength of the emboss.
     */
    constructor(strength?: number);
    /**
     * Strength of emboss.
     *
     * @member {number}
     */
    get strength(): number;
    set strength(value: number);
}

export { }
