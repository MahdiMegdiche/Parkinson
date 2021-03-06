import type { CLEAR_MODES } from '@pixi/constants';
import { Filter } from '@pixi/core';
import type { FilterSystem } from '@pixi/core';
import type { IPoint } from '@pixi/math';
import type { RenderTexture } from '@pixi/core';

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-drop-shadow|@pixi/filter-drop-shadow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export declare class DropShadowFilter extends Filter {
    /** Default constructor options. */
    static readonly defaults: DropShadowFilterOptions;
    /** Hide the contents, only show the shadow. */
    shadowOnly: boolean;
    /** Angle of the shadow in degrees. */
    angle: number;
    private _distance;
    private _resolution;
    private _tintFilter;
    private _blurFilter;
    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.rotation=45] - The angle of the shadow in degrees.
     * @param {number} [options.distance=5] - Distance of shadow
     * @param {number} [options.color=0x000000] - Color of the shadow
     * @param {number} [options.alpha=0.5] - Alpha of the shadow
     * @param {boolean} [options.shadowOnly=false] - Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<DropShadowFilterOptions>);
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void;
    /**
     * Recalculate the proper padding amount.
     * @private
     */
    private _updatePadding;
    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    private _updateShift;
    /**
     * The resolution of the filter.
     *
     * @member {number}
     * @default PIXI.settings.FILTER_RESOLUTION
     */
    get resolution(): number;
    set resolution(value: number);
    /**
     * Distance offset of the shadow
     * @member {number}
     * @default 5
     */
    get distance(): number;
    set distance(value: number);
    /**
     * The angle of the shadow in degrees
     * @member {number}
     * @default 2
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * The alpha of the shadow
     * @member {number}
     * @default 1
     */
    get alpha(): number;
    set alpha(value: number);
    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get color(): number;
    set color(value: number);
    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
     */
    get kernels(): number[];
    set kernels(value: number[]);
    /**
     * The blur of the shadow
     * @member {number}
     * @default 2
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality(): number;
    set quality(value: number);
    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize(): PixelSizeValue;
    set pixelSize(value: PixelSizeValue);
}

export declare interface DropShadowFilterOptions {
    rotation: number;
    distance: number;
    color: number;
    alpha: number;
    shadowOnly: boolean;
    blur: number;
    quality: number;
    kernels: number[] | null;
    pixelSize: PixelSizeValue;
    resolution: number;
}

declare type PixelSizeValue = number | number[] | IPoint;

export { }
