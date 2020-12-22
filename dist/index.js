'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vuePropertyDecorator = require('vue-property-decorator');
var Handsontable = require('handsontable');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Handsontable__default = /*#__PURE__*/_interopDefaultLegacy(Handsontable);

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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function* range(start, end, step = 1) {
    if (step <= 0) {
        throw new Error('Step must be a positive number');
    }
    while (start < end) {
        yield start;
        start += step;
    }
}
function debounce(fn, delay) {
    let timeout = null;
    return function (...args) {
        if (timeout === null) {
            timeout = window.setTimeout(() => {
                timeout = null;
                fn.apply(args);
            }, delay);
        }
    };
}
function deepCopy(data) {
    if (Array.isArray(data)) {
        return data.map(deepCopy);
    }
    else if (typeof data === 'object') {
        if (data === null) {
            return data;
        }
        const entries = Object.entries(data)
            .map(([key, value]) => [key, deepCopy(value)]);
        return Object.fromEntries(entries);
    }
    else {
        return data;
    }
}
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
        if (a === null || b === null) {
            return false;
        }
        const aKeys = new Set(Object.keys(a));
        const bKeys = new Set(Object.keys(b));
        if (aKeys.size !== bKeys.size) {
            return false;
        }
        const allKeys = new Set([...aKeys, ...bKeys]);
        if (allKeys.size !== aKeys.size) {
            return false;
        }
        for (const key of allKeys) {
            const aValue = a[key];
            const bValue = b[key];
            if (!deepEqual(aValue, bValue)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

const instances = new WeakMap();
const renderers = new WeakMap();
const resizeObserver = new ResizeObserver(wraps => wraps.forEach(({ target }) => { var _a; return (_a = renderers.get(target)) === null || _a === void 0 ? void 0 : _a(); }));
const FILLIN = 'fillIn';
let Hot = class Hot extends vuePropertyDecorator.Vue {
    mounted() {
        const instance = new Handsontable__default['default'](this.hot, this.staticConfig);
        const parentEl = this.hot.parentElement;
        instances.set(this, instance);
        if (parentEl) {
            renderers.set(parentEl, debounce(this.hackyRender.bind(this), 100));
            resizeObserver.observe(parentEl);
        }
        instance.addHook('afterChange', this.change.bind(this));
        instance.loadData(deepCopy(this.value));
        instance.validateRows([...range(0, this.value.length)]);
    }
    beforeDestroy() {
        instances.delete(this);
        const parentEl = this.hot.parentElement;
        if (parentEl) {
            renderers.delete(parentEl);
            resizeObserver.unobserve(parentEl);
        }
    }
    get instance() {
        return instances.get(this);
    }
    get staticConfig() {
        let { columns } = this;
        if (this.readOnly) {
            columns = columns.map(col => (Object.assign({ editor: false }, col)));
        }
        if (this.emptyCol) {
            columns.push({ data: '', title: ' ', readOnly: true });
        }
        const config = {
            columns,
            dataSchema: this.dataSchema,
            autoColumnSize: true,
            manualColumnResize: true,
            autoWrapRow: true,
            stretchH: this.stretchLast ? 'last' : 'all',
            licenseKey: this.licenseKey,
            preventOverflow: 'vertical',
        };
        if (this.readOnly) {
            config.beforePaste = () => false;
        }
        return config;
    }
    requestRender() {
        var _a;
        const parentEl = this.hot.parentElement;
        if (parentEl) {
            (_a = renderers.get(parentEl)) === null || _a === void 0 ? void 0 : _a();
        }
    }
    hackyRender() {
        const { instance } = this;
        instance.updateSettings({ height: 'auto' });
        instance.render();
        this.hackyRenderSecondRun();
    }
    hackyRenderSecondRun() {
        const parentEl = this.hot.parentElement;
        if (parentEl) {
            let { height, paddingTop, paddingBottom } = window.getComputedStyle(parentEl);
            const computedHeight = parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom);
            const { instance } = this;
            instance.updateSettings({ height: computedHeight });
            instance.render();
        }
    }
    change(changes, source) {
        const { instance } = this;
        const sourceData = instance.getSourceData();
        if (!deepEqual(sourceData, this.value)) {
            this.$emit('input', sourceData);
        }
        if (source === FILLIN || changes === null) {
            return;
        }
        this.$emit('change', changes.map(([row, prop, oldVal, newVal]) => [
            instance.toPhysicalRow(row),
            prop,
            oldVal,
            newVal
        ]));
    }
    watchValue(value) {
        const { instance } = this;
        instance.updateSettings({ height: 'auto' });
        instance.loadData(deepCopy(value));
        instance.validateRows([...range(0, value.length)]);
        this.hackyRenderSecondRun();
    }
    watchConfig(config) {
        this.instance.updateSettings(config);
    }
    fillIn(data) {
        const { instance } = this;
        const changes = [];
        for (const [row, props] of data) {
            for (const [prop, val] of props) {
                changes.push([instance.toVisualRow(row), prop, val]);
            }
        }
        instance.setDataAtRowProp(changes, FILLIN);
    }
};
__decorate([
    vuePropertyDecorator.Prop({ type: String, required: true })
], Hot.prototype, "licenseKey", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Array, required: true })
], Hot.prototype, "columns", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Array, default: () => [] })
], Hot.prototype, "value", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Object })
], Hot.prototype, "dataSchema", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Boolean, default: false })
], Hot.prototype, "readOnly", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Boolean, default: false })
], Hot.prototype, "emptyCol", void 0);
__decorate([
    vuePropertyDecorator.Prop({ type: Boolean, default: true })
], Hot.prototype, "stretchLast", void 0);
__decorate([
    vuePropertyDecorator.Ref()
], Hot.prototype, "hot", void 0);
__decorate([
    vuePropertyDecorator.Watch('value')
], Hot.prototype, "watchValue", null);
__decorate([
    vuePropertyDecorator.Watch('staticConfig')
], Hot.prototype, "watchConfig", null);
Hot = __decorate([
    vuePropertyDecorator.Component
], Hot);
var script = Hot;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"hot",staticClass:"hot-mount"})};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-044db90e_0", { source: ".handsontable[data-v-044db90e] th{text-align:left;color:var(--hot-header-color);background:var(--hot-header-bg);letter-spacing:.8px;text-transform:uppercase;font-size:11px;font-weight:700}.handsontable[data-v-044db90e] td,.handsontable[data-v-044db90e] th{height:29px!important;line-height:30px;padding:2px 6px;border-color:var(--hot-border-color)!important}.handsontable[data-v-044db90e] thead th .relative{padding:2px 6px}.handsontableInput[data-v-044db90e]{line-height:30px;font-size:14px}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-044db90e";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

exports.Hot = __vue_component__;
