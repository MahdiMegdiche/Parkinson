/*!
 * @pixi/filter-color-overlay - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-color-overlay is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters=function(r,o,t){"use strict";var e=function(r,o){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(r[t]=o[t])})(r,o)};Object.create;Object.create;var n=function(r){function o(o,t){void 0===o&&(o=0),void 0===t&&(t=1);var e=r.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}","varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nuniform float alpha;\n\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4(mix(currentColor.rgb, color.rgb, currentColor.a * alpha), currentColor.a);\n}\n")||this;return e._color=0,e._alpha=1,e.uniforms.color=new Float32Array(3),e.color=o,e.alpha=t,e}return function(r,o){function t(){this.constructor=r}e(r,o),r.prototype=null===o?Object.create(o):(t.prototype=o.prototype,new t)}(o,r),Object.defineProperty(o.prototype,"color",{get:function(){return this._color},set:function(r){var o=this.uniforms.color;"number"==typeof r?(t.hex2rgb(r,o),this._color=r):(o[0]=r[0],o[1]=r[1],o[2]=r[2],this._color=t.rgb2hex(o))},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"alpha",{get:function(){return this._alpha},set:function(r){this.uniforms.alpha=r,this._alpha=r},enumerable:!1,configurable:!0}),o}(o.Filter);return r.ColorOverlayFilter=n,Object.defineProperty(r,"__esModule",{value:!0}),r}({},PIXI,PIXI.utils);Object.assign(PIXI.filters,__filters);
//# sourceMappingURL=filter-color-overlay.js.map