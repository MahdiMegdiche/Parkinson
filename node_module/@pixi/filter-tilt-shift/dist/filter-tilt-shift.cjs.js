/*!
 * @pixi/filter-tilt-shift - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-tilt-shift is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@pixi/core');
var math = require('@pixi/math');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) { if (Object.prototype.hasOwnProperty.call(b, p)) { d[p] = b[p]; } } };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

var fragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n";

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/
/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftAxisFilter = /** @class */ (function (_super) {
    __extends(TiltShiftAxisFilter, _super);
    function TiltShiftAxisFilter(blur, gradientBlur, start, end) {
        if (blur === void 0) { blur = 100; }
        if (gradientBlur === void 0) { gradientBlur = 600; }
        var _this = _super.call(this, vertex, fragment) || this;
        _this.uniforms.blur = blur;
        _this.uniforms.gradientBlur = gradientBlur;
        _this.uniforms.start = start || new math.Point(0, window.innerHeight / 2);
        _this.uniforms.end = end || new math.Point(600, window.innerHeight / 2);
        _this.uniforms.delta = new math.Point(30, 30);
        _this.uniforms.texSize = new math.Point(window.innerWidth, window.innerHeight);
        _this.updateDelta();
        return _this;
    }
    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    TiltShiftAxisFilter.prototype.updateDelta = function () {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0;
    };
    Object.defineProperty(TiltShiftAxisFilter.prototype, "blur", {
        /**
         * The strength of the blur.
         *
         * @member {number}
         * @memberof PIXI.filters.TiltShiftAxisFilter#
         */
        get: function () {
            return this.uniforms.blur;
        },
        set: function (value) {
            this.uniforms.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftAxisFilter.prototype, "gradientBlur", {
        /**
         * The strength of the gradient blur.
         *
         * @member {number}
         * @memberof PIXI.filters.TiltShiftAxisFilter#
         */
        get: function () {
            return this.uniforms.gradientBlur;
        },
        set: function (value) {
            this.uniforms.gradientBlur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftAxisFilter.prototype, "start", {
        /**
         * The X value to start the effect at.
         *
         * @member {PIXI.Point}
         * @memberof PIXI.filters.TiltShiftAxisFilter#
         */
        get: function () {
            return this.uniforms.start;
        },
        set: function (value) {
            this.uniforms.start = value;
            this.updateDelta();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftAxisFilter.prototype, "end", {
        /**
         * The X value to end the effect at.
         *
         * @member {PIXI.Point}
         * @memberof PIXI.filters.TiltShiftAxisFilter#
         */
        get: function () {
            return this.uniforms.end;
        },
        set: function (value) {
            this.uniforms.end = value;
            this.updateDelta();
        },
        enumerable: false,
        configurable: true
    });
    return TiltShiftAxisFilter;
}(core.Filter));

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/
/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftXFilter = /** @class */ (function (_super) {
    __extends(TiltShiftXFilter, _super);
    function TiltShiftXFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updates the filter delta values.
     */
    TiltShiftXFilter.prototype.updateDelta = function () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt((dx * dx) + (dy * dy));
        this.uniforms.delta.x = dx / d;
        this.uniforms.delta.y = dy / d;
    };
    return TiltShiftXFilter;
}(TiltShiftAxisFilter));

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/
/**
 * A TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftYFilter = /** @class */ (function (_super) {
    __extends(TiltShiftYFilter, _super);
    function TiltShiftYFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updates the filter delta values.
     */
    TiltShiftYFilter.prototype.updateDelta = function () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt((dx * dx) + (dy * dy));
        this.uniforms.delta.x = -dy / d;
        this.uniforms.delta.y = dx / d;
    };
    return TiltShiftYFilter;
}(TiltShiftAxisFilter));

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/
/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/tilt-shift.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-tilt-shift|@pixi/filter-tilt-shift}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
var TiltShiftFilter = /** @class */ (function (_super) {
    __extends(TiltShiftFilter, _super);
    /**
     * @param {number} [blur=100] - The strength of the blur.
     * @param {number} [gradientBlur=600] - The strength of the gradient blur.
     * @param {PIXI.Point} [start=null] - The Y value to start the effect at.
     * @param {PIXI.Point} [end=null] - The Y value to end the effect at.
     */
    function TiltShiftFilter(blur, gradientBlur, start, end) {
        if (blur === void 0) { blur = 100; }
        if (gradientBlur === void 0) { gradientBlur = 600; }
        var _this = _super.call(this) || this;
        _this.tiltShiftXFilter = new TiltShiftXFilter(blur, gradientBlur, start, end);
        _this.tiltShiftYFilter = new TiltShiftYFilter(blur, gradientBlur, start, end);
        return _this;
    }
    TiltShiftFilter.prototype.apply = function (filterManager, input, output, clearMode) {
        var renderTarget = filterManager.getFilterTexture();
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget, 1);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output, clearMode);
        filterManager.returnFilterTexture(renderTarget);
    };
    Object.defineProperty(TiltShiftFilter.prototype, "blur", {
        /**
         * The strength of the blur.
         *
         * @member {number}
         */
        get: function () {
            return this.tiltShiftXFilter.blur;
        },
        set: function (value) {
            this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftFilter.prototype, "gradientBlur", {
        /**
         * The strength of the gradient blur.
         *
         * @member {number}
         */
        get: function () {
            return this.tiltShiftXFilter.gradientBlur;
        },
        set: function (value) {
            this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftFilter.prototype, "start", {
        /**
         * The Y value to start the effect at.
         *
         * @member {PIXI.Point}
         */
        get: function () {
            return this.tiltShiftXFilter.start;
        },
        set: function (value) {
            this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TiltShiftFilter.prototype, "end", {
        /**
         * The Y value to end the effect at.
         *
         * @member {PIXI.Point}
         */
        get: function () {
            return this.tiltShiftXFilter.end;
        },
        set: function (value) {
            this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
        },
        enumerable: false,
        configurable: true
    });
    return TiltShiftFilter;
}(core.Filter));

exports.TiltShiftAxisFilter = TiltShiftAxisFilter;
exports.TiltShiftFilter = TiltShiftFilter;
exports.TiltShiftXFilter = TiltShiftXFilter;
exports.TiltShiftYFilter = TiltShiftYFilter;
//# sourceMappingURL=filter-tilt-shift.cjs.js.map
