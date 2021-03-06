import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/outline.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-outline|@pixi/filter-outline}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters} *
 * @example
 *  someSprite.filters = [new OutlineFilter(2, 0x99ff99)];
 */
export declare class OutlineFilter extends Filter {
    /** The minimum number of samples for rendering outline. */
    static MIN_SAMPLES: number;
    /** The maximum number of samples for rendering outline. */
    static MAX_SAMPLES: number;
    private _thickness;
    /**
     * @param {number} [thickness=1] - The tickness of the outline. Make it 2 times more for resolution 2
     * @param {number} [color=0x000000] - The color of the outline.
     * @param {number} [quality=0.1] - The quality of the outline from `0` to `1`, using a higher quality
     *        setting will result in slower performance and more accuracy.
     */
    constructor(thickness?: number, color?: number, quality?: number);
    /**
     * Get the angleStep by quality
     * @private
     */
    private static getAngleStep;
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * The color of the glow.
     * @member {number}
     * @default 0x000000
     */
    get color(): number;
    set color(value: number);
    /**
     * The thickness of the outline.
     * @member {number}
     * @default 1
     */
    get thickness(): number;
    set thickness(value: number);
}

export { }
