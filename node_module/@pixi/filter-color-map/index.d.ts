import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { RenderTexture } from '@pixi/core';
import { Texture } from '@pixi/core';
import { TextureSource } from '@pixi/core';

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-map.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-map|@pixi/filter-color-map}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class ColorMapFilter extends Filter {
    /** The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image. */
    mix: number;
    private _size;
    private _sliceSize;
    private _slicePixelSize;
    private _sliceInnerSize;
    private _nearest;
    private _scaleMode;
    private _colorMap;
    /**
     * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The
     *        colorMap texture of the filter.
     * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
     * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     */
    constructor(colorMap: ColorMapSource, nearest?: boolean, mix?: number);
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * the size of one color slice
     * @member {number}
     * @readonly
     */
    get colorSize(): number;
    /**
     * the colorMap texture
     * @member {PIXI.Texture}
     */
    get colorMap(): ColorMapSource;
    set colorMap(colorMap: ColorMapSource);
    /**
     * Whether use NEAREST for colorMap texture.
     * @member {boolean}
     */
    get nearest(): boolean;
    set nearest(nearest: boolean);
    /**
     * If the colorMap is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    updateColorMap(): void;
    /**
     * Destroys this filter
     *
     * @param {boolean} [destroyBase=false] - Whether to destroy the base texture of colorMap as well
     */
    destroy(destroyBase?: boolean): void;
}

declare type ColorMapSource = TextureSource | Texture | null;

export { }
