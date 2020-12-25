"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("vue-property-decorator");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=t(require("handsontable"));
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
***************************************************************************** */function o(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}function*r(e,t,n=1){if(n<=0)throw new Error("Step must be a positive number");for(;e<t;)yield e,e+=n}function a(e){if(Array.isArray(e))return e.map(a);if("object"==typeof e){if(null===e)return e;const t=Object.entries(e).map((([e,t])=>[e,a(t)]));return Object.fromEntries(t)}return e}function i(e,t){if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!i(e[n],t[n]))return!1;return!0}if("object"==typeof e&&"object"==typeof t){if(null===e||null===t)return!1;const n=new Set(Object.keys(e)),o=new Set(Object.keys(t));if(n.size!==o.size)return!1;const r=new Set([...n,...o]);if(r.size!==n.size)return!1;for(const n of r){if(!i(e[n],t[n]))return!1}return!0}return!1}const s=new WeakMap,l=new WeakMap,d=new ResizeObserver((e=>e.forEach((({target:e})=>{var t;return null===(t=l.get(e))||void 0===t?void 0:t()}))));let c=class extends e.Vue{mounted(){const e=new n.default(this.hot,this.staticConfig),t=this.hot.parentElement;s.set(this,e),t&&(l.set(t,function(e,t){let n=null;return function(...o){null===n&&(n=window.setTimeout((()=>{n=null,e.apply(o)}),t))}}(this.hackyRender.bind(this),100)),d.observe(t)),e.addHook("afterChange",this.change.bind(this)),e.loadData(a(this.value)),e.validateRows([...r(0,this.value.length)])}beforeDestroy(){s.delete(this);const e=this.hot.parentElement;e&&(l.delete(e),d.unobserve(e))}get instance(){return s.get(this)}get staticConfig(){let{columns:e}=this;this.readOnly&&(e=e.map((e=>Object.assign({editor:!1},e)))),this.emptyCol&&e.push({data:"",title:" ",readOnly:!0});const t={columns:e,dataSchema:this.dataSchema,autoColumnSize:!0,manualColumnResize:!0,autoWrapRow:!0,stretchH:this.stretchLast?"last":"all",licenseKey:this.licenseKey,preventOverflow:"vertical"};return this.readOnly&&(t.beforePaste=()=>!1),t}requestRender(){var e;const t=this.hot.parentElement;t&&(null===(e=l.get(t))||void 0===e||e())}hackyRender(){const{instance:e}=this;e.updateSettings({height:"auto"}),e.render(),this.hackyRenderSecondRun()}hackyRenderSecondRun(){const e=this.hot.parentElement;if(e){let{height:t,paddingTop:n,paddingBottom:o}=window.getComputedStyle(e);const r=parseFloat(t)-parseFloat(n)-parseFloat(o),{instance:a}=this;a.updateSettings({height:r}),a.render()}}change(e,t){const{instance:n}=this,o=n.getSourceData();i(o,this.value)||this.$emit("input",o),"fillIn"!==t&&null!==e&&this.$emit("change",e.map((([e,t,o,r])=>[n.toPhysicalRow(e),t,o,r])))}watchValue(e){const{instance:t}=this;t.updateSettings({height:"auto"}),t.loadData(a(e)),t.validateRows([...r(0,e.length)]),this.hackyRenderSecondRun()}watchConfig(e){this.instance.updateSettings(e)}fillIn(e){const{instance:t}=this,n=[];for(const[o,r]of e)for(const[e,a]of r)n.push([t.toVisualRow(o),e,a]);t.setDataAtRowProp(n,"fillIn")}};o([e.Prop({type:String,required:!0})],c.prototype,"licenseKey",void 0),o([e.Prop({type:Array,required:!0})],c.prototype,"columns",void 0),o([e.Prop({type:Array,default:()=>[]})],c.prototype,"value",void 0),o([e.Prop({type:Object})],c.prototype,"dataSchema",void 0),o([e.Prop({type:Boolean,default:!1})],c.prototype,"readOnly",void 0),o([e.Prop({type:Boolean,default:!1})],c.prototype,"emptyCol",void 0),o([e.Prop({type:Boolean,default:!0})],c.prototype,"stretchLast",void 0),o([e.Ref()],c.prototype,"hot",void 0),o([e.Watch("value")],c.prototype,"watchValue",null),o([e.Watch("staticConfig")],c.prototype,"watchConfig",null),c=o([e.Component],c);var p=c;function u(e,t,n,o,r,a,i,s,l,d){"boolean"!=typeof i&&(l=s,s=i,i=!1);const c="function"==typeof n?n.options:n;let p;if(e&&e.render&&(c.render=e.render,c.staticRenderFns=e.staticRenderFns,c._compiled=!0,r&&(c.functional=!0)),o&&(c._scopeId=o),a?(p=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,l(e)),e&&e._registeredComponents&&e._registeredComponents.add(a)},c._ssrRegister=p):t&&(p=i?function(e){t.call(this,d(e,this.$root.$options.shadowRoot))}:function(e){t.call(this,s(e))}),p)if(c.functional){const e=c.render;c.render=function(t,n){return p.call(n),e(t,n)}}else{const e=c.beforeCreate;c.beforeCreate=e?[].concat(e,p):[p]}return n}const h="undefined"!=typeof navigator&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());function f(e){return(e,t)=>function(e,t){const n=h?t.media||"default":e,o=m[n]||(m[n]={ids:new Set,styles:[]});if(!o.ids.has(e)){o.ids.add(e);let n=t.source;if(t.map&&(n+="\n/*# sourceURL="+t.map.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t.map))))+" */"),o.element||(o.element=document.createElement("style"),o.element.type="text/css",t.media&&o.element.setAttribute("media",t.media),void 0===y&&(y=document.head||document.getElementsByTagName("head")[0]),y.appendChild(o.element)),"styleSheet"in o.element)o.styles.push(n),o.element.styleSheet.cssText=o.styles.filter(Boolean).join("\n");else{const e=o.ids.size-1,t=document.createTextNode(n),r=o.element.childNodes;r[e]&&o.element.removeChild(r[e]),r.length?o.element.insertBefore(t,r[e]):o.element.appendChild(t)}}}(e,t)}let y;const m={};const v=u({render:function(){var e=this.$createElement;return(this._self._c||e)("div",{ref:"hot",staticClass:"hot-mount"})},staticRenderFns:[]},(function(e){e&&e("data-v-1cbd01bf_0",{source:".handsontable[data-v-1cbd01bf] th{text-align:left;color:var(--hot-header-color);background:var(--hot-header-bg);letter-spacing:.8px;text-transform:uppercase;font-size:11px;font-weight:700}.handsontable[data-v-1cbd01bf] td,.handsontable[data-v-1cbd01bf] th{height:29px!important;line-height:30px;padding:2px 6px;border-color:var(--hot-border-color)!important}.handsontable[data-v-1cbd01bf] thead th .relative{padding:2px 6px}.handsontableInput[data-v-1cbd01bf]{line-height:30px;font-size:14px}",map:void 0,media:void 0})}),p,"data-v-1cbd01bf",false,undefined,!1,f,void 0,void 0);exports.Hot=v;
