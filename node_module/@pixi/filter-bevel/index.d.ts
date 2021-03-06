import { Filter } from '@pixi/core';

/**
 * Bevel Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bevel.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bevel|@pixi/filter-bevel}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class BevelFilter extends Filter {
    private _thickness;
    private _angle;
    /**
     * @param {object} [options] - The optional parameters of the filter.
     * @param {number} [options.rotation = 45] - The angle of the light in degrees.
     * @param {number} [options.thickness = 2] - The tickness of the bevel.
     * @param {number} [options.lightColor = 0xffffff] - Color of the light.
     * @param {number} [options.lightAlpha = 0.7] - Alpha of the light.
     * @param {number} [options.shadowColor = 0x000000] - Color of the shadow.
     * @param {number} [options.shadowAlpha = 0.7] - Alpha of the shadow.
     */
    constructor(options?: Partial<BevelFilterOptions>);
    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    private _updateTransform;
    /**
     * The angle of the light in degrees.
     * @member {number}
     * @default 45
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * The tickness of the bevel.
     * @member {number}
     * @default 2
     */
    get thickness(): number;
    set thickness(value: number);
    /**
     * Color of the light.
     * @member {number}
     * @default 0xffffff
     */
    get lightColor(): number;
    set lightColor(value: number);
    /**
     * Alpha of the light.
     * @member {number}
     * @default 0.7
     */
    get lightAlpha(): number;
    set lightAlpha(value: number);
    /**
     * Color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get shadowColor(): number;
    set shadowColor(value: number);
    /**
     * Alpha of the shadow.
     * @member {number}
     * @default 0.7
     */
    get shadowAlpha(): number;
    set shadowAlpha(value: number);
}

export declare interface BevelFilterOptions {
    rotation: number;
    thickness: number;
    lightColor: number;
    lightAlpha: number;
    shadowColor: number;
    shadowAlpha: number;
}

export { }
