"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=extractViewBox;exports.alignEnum=exports.meetOrSliceTypes=void 0;var meetOrSliceTypes={meet:0,slice:1,none:2};exports.meetOrSliceTypes=meetOrSliceTypes;var alignEnum=['xMinYMin','xMidYMin','xMaxYMin','xMinYMid','xMidYMid','xMaxYMid','xMinYMax','xMidYMax','xMaxYMax','none'].reduce(function(prev,name){prev[name]=name;return prev;},{});exports.alignEnum=alignEnum;var spacesRegExp=/\s+/;function extractViewBox(props){var viewBox=props.viewBox,preserveAspectRatio=props.preserveAspectRatio;if(!viewBox){return null;}var params=(Array.isArray(viewBox)?viewBox:viewBox.trim().split(spacesRegExp)).map(Number);if(params.length!==4||params.some(isNaN)){console.warn('Invalid `viewBox` prop:'+viewBox);return null;}var modes=preserveAspectRatio?preserveAspectRatio.trim().split(spacesRegExp):[];var align=modes[0];var meetOrSlice=modes[1];return{minX:params[0],minY:params[1],vbWidth:params[2],vbHeight:params[3],align:alignEnum[align]||'xMidYMid',meetOrSlice:meetOrSliceTypes[meetOrSlice]||0};}
//# sourceMappingURL=extractViewBox.js.map