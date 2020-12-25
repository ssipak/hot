import{Prop as e,Ref as t,Watch as n,Component as o,Vue as a}from"vue-property-decorator";import r from"handsontable";
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
***************************************************************************** */function i(e,t,n,o){var a,r=arguments.length,i=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(i=(r<3?a(i):r>3?a(t,n,i):a(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i}function*s(e,t,n=1){if(n<=0)throw new Error("Step must be a positive number");for(;e<t;)yield e,e+=n}function l(e){if(Array.isArray(e))return e.map(l);if("object"==typeof e){if(null===e)return e;const t=Object.entries(e).map((([e,t])=>[e,l(t)]));return Object.fromEntries(t)}return e}function d(e,t){if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!d(e[n],t[n]))return!1;return!0}if("object"==typeof e&&"object"==typeof t){if(null===e||null===t)return!1;const n=new Set(Object.keys(e)),o=new Set(Object.keys(t));if(n.size!==o.size)return!1;const a=new Set([...n,...o]);if(a.size!==n.size)return!1;for(const n of a){if(!d(e[n],t[n]))return!1}return!0}return!1}const c=new WeakMap,h=new WeakMap,p=new ResizeObserver((e=>e.forEach((({target:e})=>{var t;return null===(t=h.get(e))||void 0===t?void 0:t()}))));let u=class extends a{mounted(){const e=new r(this.hot,this.staticConfig),t=this.hot.parentElement;c.set(this,e),t&&(h.set(t,function(e,t){let n=null;return function(...o){null===n&&(n=window.setTimeout((()=>{n=null,e.apply(o)}),t))}}(this.hackyRender.bind(this),100)),p.observe(t)),e.addHook("afterChange",this.change.bind(this)),e.loadData(l(this.value)),e.validateRows([...s(0,this.value.length)])}beforeDestroy(){c.delete(this);const e=this.hot.parentElement;e&&(h.delete(e),p.unobserve(e))}get instance(){return c.get(this)}get staticConfig(){let{columns:e}=this;this.readOnly&&(e=e.map((e=>Object.assign({editor:!1},e)))),this.emptyCol&&e.push({data:"",title:" ",readOnly:!0});const t={columns:e,dataSchema:this.dataSchema,autoColumnSize:!0,manualColumnResize:!0,autoWrapRow:!0,stretchH:this.stretchLast?"last":"all",licenseKey:this.licenseKey,preventOverflow:"vertical"};return this.readOnly&&(t.beforePaste=()=>!1),t}requestRender(){var e;const t=this.hot.parentElement;t&&(null===(e=h.get(t))||void 0===e||e())}hackyRender(){const{instance:e}=this;e.updateSettings({height:"auto"}),e.render(),this.hackyRenderSecondRun()}hackyRenderSecondRun(){const e=this.hot.parentElement;if(e){let{height:t,paddingTop:n,paddingBottom:o}=window.getComputedStyle(e);const a=parseFloat(t)-parseFloat(n)-parseFloat(o),{instance:r}=this;r.updateSettings({height:a}),r.render()}}change(e,t){const{instance:n}=this,o=n.getSourceData();d(o,this.value)||this.$emit("input",o),"fillIn"!==t&&null!==e&&this.$emit("change",e.map((([e,t,o,a])=>[n.toPhysicalRow(e),t,o,a])))}watchValue(e){const{instance:t}=this;t.updateSettings({height:"auto"}),t.loadData(l(e)),t.validateRows([...s(0,e.length)]),this.hackyRenderSecondRun()}watchConfig(e){this.instance.updateSettings(e)}fillIn(e){const{instance:t}=this,n=[];for(const[o,a]of e)for(const[e,r]of a)n.push([t.toVisualRow(o),e,r]);t.setDataAtRowProp(n,"fillIn")}};i([e({type:String,required:!0})],u.prototype,"licenseKey",void 0),i([e({type:Array,required:!0})],u.prototype,"columns",void 0),i([e({type:Array,default:()=>[]})],u.prototype,"value",void 0),i([e({type:Object})],u.prototype,"dataSchema",void 0),i([e({type:Boolean,default:!1})],u.prototype,"readOnly",void 0),i([e({type:Boolean,default:!1})],u.prototype,"emptyCol",void 0),i([e({type:Boolean,default:!0})],u.prototype,"stretchLast",void 0),i([t()],u.prototype,"hot",void 0),i([n("value")],u.prototype,"watchValue",null),i([n("staticConfig")],u.prototype,"watchConfig",null),u=i([o],u);var f=u;function m(e,t,n,o,a,r,i,s,l,d){"boolean"!=typeof i&&(l=s,s=i,i=!1);const c="function"==typeof n?n.options:n;let h;if(e&&e.render&&(c.render=e.render,c.staticRenderFns=e.staticRenderFns,c._compiled=!0,a&&(c.functional=!0)),o&&(c._scopeId=o),r?(h=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,l(e)),e&&e._registeredComponents&&e._registeredComponents.add(r)},c._ssrRegister=h):t&&(h=i?function(e){t.call(this,d(e,this.$root.$options.shadowRoot))}:function(e){t.call(this,s(e))}),h)if(c.functional){const e=c.render;c.render=function(t,n){return h.call(n),e(t,n)}}else{const e=c.beforeCreate;c.beforeCreate=e?[].concat(e,h):[h]}return n}const y="undefined"!=typeof navigator&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());function g(e){return(e,t)=>function(e,t){const n=y?t.media||"default":e,o=b[n]||(b[n]={ids:new Set,styles:[]});if(!o.ids.has(e)){o.ids.add(e);let n=t.source;if(t.map&&(n+="\n/*# sourceURL="+t.map.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t.map))))+" */"),o.element||(o.element=document.createElement("style"),o.element.type="text/css",t.media&&o.element.setAttribute("media",t.media),void 0===v&&(v=document.head||document.getElementsByTagName("head")[0]),v.appendChild(o.element)),"styleSheet"in o.element)o.styles.push(n),o.element.styleSheet.cssText=o.styles.filter(Boolean).join("\n");else{const e=o.ids.size-1,t=document.createTextNode(n),a=o.element.childNodes;a[e]&&o.element.removeChild(a[e]),a.length?o.element.insertBefore(t,a[e]):o.element.appendChild(t)}}}(e,t)}let v;const b={};const R=m({render:function(){var e=this.$createElement;return(this._self._c||e)("div",{ref:"hot",staticClass:"hot-mount"})},staticRenderFns:[]},(function(e){e&&e("data-v-1cbd01bf_0",{source:".handsontable[data-v-1cbd01bf] th{text-align:left;color:var(--hot-header-color);background:var(--hot-header-bg);letter-spacing:.8px;text-transform:uppercase;font-size:11px;font-weight:700}.handsontable[data-v-1cbd01bf] td,.handsontable[data-v-1cbd01bf] th{height:29px!important;line-height:30px;padding:2px 6px;border-color:var(--hot-border-color)!important}.handsontable[data-v-1cbd01bf] thead th .relative{padding:2px 6px}.handsontableInput[data-v-1cbd01bf]{line-height:30px;font-size:14px}",map:void 0,media:void 0})}),f,"data-v-1cbd01bf",false,undefined,!1,g,void 0,void 0);export{R as Hot};
