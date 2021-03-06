import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';
import type { Texture } from '@pixi/core';

declare type Color = number | number[];

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/simple-lightmap.png)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @see {@link https://www.npmjs.com/package/@pixi/filter-simple-lightmap|@pixi/filter-simple-lightmap}
* @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
*
* @example
*  displayObject.filters = [new SimpleLightmapFilter(texture, 0x666666)];
*/
export declare class SimpleLightmapFilter extends Filter {
    private _color;
    /**
     * @param {PIXI.Texture} texture - a texture where your lightmap is rendered
     * @param {Array<number>|number} [color=0x000000] - An RGBA array of the ambient color
     * @param {number} [alpha=1] - Default alpha set independent of color (if it's a number, not array).
     */
    constructor(texture: Texture, color?: Color, alpha?: number);
    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * a texture where your lightmap is rendered
     * @member {PIXI.Texture}
     */
    get texture(): Texture;
    set texture(value: Texture);
    /**
     * An RGBA array of the ambient color or a hex color without alpha
     * @member {Array<number>|number}
     */
    set color(value: Color);
    get color(): Color;
    /**
     * When setting `color` as hex, this can be used to set alpha independently.
     * @member {number}
     */
    get alpha(): number;
    set alpha(value: number);
}

export { }
