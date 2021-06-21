/*!
 * @pixi/filter-tilt-shift - v4.1.0
 * Compiled Mon, 03 May 2021 02:14:46 UTC
 *
 * @pixi/filter-tilt-shift is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters=function(t,e,r){"use strict";var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,e)};function i(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}Object.create;Object.create;var o=function(t){function e(e,n,i,o){void 0===e&&(e=100),void 0===n&&(n=600);var u=t.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}","varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n")||this;return u.uniforms.blur=e,u.uniforms.gradientBlur=n,u.uniforms.start=i||new r.Point(0,window.innerHeight/2),u.uniforms.end=o||new r.Point(600,window.innerHeight/2),u.uniforms.delta=new r.Point(30,30),u.uniforms.texSize=new r.Point(window.innerWidth,window.innerHeight),u.updateDelta(),u}return i(e,t),e.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0},Object.defineProperty(e.prototype,"blur",{get:function(){return this.uniforms.blur},set:function(t){this.uniforms.blur=t},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"gradientBlur",{get:function(){return this.uniforms.gradientBlur},set:function(t){this.uniforms.gradientBlur=t},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"start",{get:function(){return this.uniforms.start},set:function(t){this.uniforms.start=t,this.updateDelta()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"end",{get:function(){return this.uniforms.end},set:function(t){this.uniforms.end=t,this.updateDelta()},enumerable:!1,configurable:!0}),e}(e.Filter),u=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return i(e,t),e.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,e=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+e*e);this.uniforms.delta.x=t/r,this.uniforms.delta.y=e/r},e}(o),l=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return i(e,t),e.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,e=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+e*e);this.uniforms.delta.x=-e/r,this.uniforms.delta.y=t/r},e}(o),a=function(t){function e(e,r,n,i){void 0===e&&(e=100),void 0===r&&(r=600);var o=t.call(this)||this;return o.tiltShiftXFilter=new u(e,r,n,i),o.tiltShiftYFilter=new l(e,r,n,i),o}return i(e,t),e.prototype.apply=function(t,e,r,n){var i=t.getFilterTexture();this.tiltShiftXFilter.apply(t,e,i,1),this.tiltShiftYFilter.apply(t,i,r,n),t.returnFilterTexture(i)},Object.defineProperty(e.prototype,"blur",{get:function(){return this.tiltShiftXFilter.blur},set:function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"gradientBlur",{get:function(){return this.tiltShiftXFilter.gradientBlur},set:function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"start",{get:function(){return this.tiltShiftXFilter.start},set:function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"end",{get:function(){return this.tiltShiftXFilter.end},set:function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t},enumerable:!1,configurable:!0}),e}(e.Filter);return t.TiltShiftAxisFilter=o,t.TiltShiftFilter=a,t.TiltShiftXFilter=u,t.TiltShiftYFilter=l,Object.defineProperty(t,"__esModule",{value:!0}),t}({},PIXI,PIXI);Object.assign(PIXI.filters,__filters);
//# sourceMappingURL=filter-tilt-shift.js.map