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
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { ref: "hot", staticClass: "hot-mount" })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-70eb19ac_0", { source: ".handsontable[data-v-70eb19ac] th {\n  text-align: left;\n  color: var(--hot-header-color);\n  background: var(--hot-header-bg);\n  letter-spacing: 0.8px;\n  text-transform: uppercase;\n  font-size: 11px;\n  font-weight: bold;\n}\n.handsontable[data-v-70eb19ac] th,\n.handsontable[data-v-70eb19ac] td {\n  height: 29px !important;\n  line-height: 30px;\n  padding: 2px 6px;\n  border-color: var(--hot-border-color) !important;\n}\n.handsontable[data-v-70eb19ac] thead th .relative {\n  padding: 2px 6px;\n}\n.handsontableInput[data-v-70eb19ac] {\n  line-height: 30px;\n  font-size: 14px;\n}\n", map: {"version":3,"sources":["/Users/krylov/dev/ssipak/hot/src/Hot/Hot.vue","Hot.vue"],"names":[],"mappings":"AA0LA;EACA,gBAAA;EACA,8BAAA;EACA,gCAAA;EACA,qBAAA;EACA,yBAAA;EACA,eAAA;EACA,iBAAA;ACzLA;AD2LA;;EAEA,uBAAA;EACA,iBAAA;EACA,gBAAA;EACA,gDAAA;ACzLA;AD2LA;EACA,gBAAA;ACzLA;AD2LA;EACA,iBAAA;EACA,eAAA;ACzLA","file":"Hot.vue","sourcesContent":["<template>\n  <div ref=\"hot\" class=\"hot-mount\"/>\n</template>\n\n<script lang=\"ts\">\nimport { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'\nimport Handsontable from 'handsontable'\nimport GridSettings = Handsontable.GridSettings\nimport CellValue = Handsontable.CellValue\nimport RowObject = Handsontable.RowObject\nimport ColumnSettings = Handsontable.ColumnSettings\nimport CellChange = Handsontable.CellChange\nimport ChangeSource = Handsontable.ChangeSource\nimport {range, debounce, deepCopy, deepEqual} from '../utils'\n\ntype WrapFn = () => void\ntype Value = CellValue[][] | RowObject[]\n\nconst instances = new WeakMap<Vue, Handsontable>()\nconst renderers = new WeakMap<Element, WrapFn>()\n\nconst resizeObserver = new ResizeObserver(wraps =>\n  wraps.forEach(({ target }) => renderers.get(target)?.())\n)\n\nconst FILLIN = 'fillIn'\n\n@Component\nexport default class Hot<T, K extends keyof T> extends Vue {\n  @Prop({ type: String, required: true }) public licenseKey!: string\n  @Prop({ type: Array, required: true }) public columns!: ColumnSettings[]\n  @Prop({ type: Array, default: () => [] }) value!: Value\n  @Prop({ type: Object }) dataSchema: RowObject | undefined\n  @Prop({ type: Boolean, default: false }) readOnly!: boolean\n  @Prop({ type: Boolean, default: false }) emptyCol!: boolean\n  @Prop({ type: Boolean, default: true }) stretchLast!: boolean\n\n  @Ref() readonly hot!: HTMLElement\n\n  mounted () {\n    const instance = new Handsontable(this.hot, this.staticConfig)\n    const parentEl = this.hot.parentElement\n\n    instances.set(this, instance)\n    if (parentEl) {\n      renderers.set(\n        parentEl,\n        debounce(this.hackyRender.bind(this), 100)\n      )\n      resizeObserver.observe(parentEl)\n    }\n\n    instance.addHook('afterChange', this.change.bind(this))\n    instance.loadData(deepCopy(this.value))\n    instance.validateRows([...range(0, this.value.length)])\n  }\n\n  beforeDestroy () {\n    instances.delete(this)\n    const parentEl = this.hot.parentElement\n    if (parentEl) {\n      renderers.delete(parentEl)\n      resizeObserver.unobserve(parentEl)\n    }\n  }\n\n  get instance (): Handsontable {\n    return instances.get(this) as Handsontable\n  }\n\n  get staticConfig (): GridSettings {\n    let { columns } = this\n\n    if (this.readOnly) {\n      columns = columns.map(col => ({ editor: false, ...col }))\n    }\n\n    if (this.emptyCol) {\n      columns.push({ data: '', title: ' ', readOnly: true })\n    }\n\n    const config: GridSettings = {\n      columns,\n      dataSchema: this.dataSchema,\n      autoColumnSize: true,\n      manualColumnResize: true,\n      autoWrapRow: true,\n      stretchH: this.stretchLast ? 'last' : 'all',\n      licenseKey: this.licenseKey,\n      preventOverflow: 'vertical',\n    }\n\n    if (this.readOnly) {\n      config.beforePaste = () => false\n    }\n\n    return config\n  }\n\n  public requestRender() {\n    const parentEl = this.hot.parentElement\n\n    if (parentEl) {\n      renderers.get(parentEl)?.()\n    }\n  }\n\n  private hackyRender() {\n    const {instance} = this\n\n    instance.updateSettings({ height: 'auto' })\n    instance.render()\n\n    this.hackyRenderSecondRun()\n  }\n\n  private hackyRenderSecondRun() {\n    const parentEl = this.hot.parentElement\n\n    if (parentEl) {\n      let { height, paddingTop, paddingBottom } = window.getComputedStyle(parentEl)\n      const computedHeight = parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom)\n\n      const { instance } = this\n\n      instance.updateSettings({ height: computedHeight })\n      instance.render()\n    }\n  }\n\n  change (changes: CellChange[] | null, source: ChangeSource | typeof FILLIN) {\n    const { instance } = this\n\n    const sourceData = instance.getSourceData()\n\n    if (!deepEqual(sourceData, this.value)) {\n      this.$emit('input', sourceData)\n    }\n\n    if (source === FILLIN || changes === null) {\n      return\n    }\n\n    this.$emit(\n      'change',\n      changes.map(\n        ([row, prop, oldVal, newVal]) => [\n          instance.toPhysicalRow(row),\n          prop,\n          oldVal as unknown,\n          newVal as unknown\n        ]\n      )\n    )\n  }\n\n  @Watch('value') watchValue (value: Value) {\n    const { instance } = this\n    instance.updateSettings({ height: 'auto' })\n    instance.loadData(deepCopy(value))\n    instance.validateRows([...range(0, value.length)])\n    this.hackyRenderSecondRun()\n  }\n\n  @Watch('staticConfig') watchConfig (config: GridSettings) {\n    this.instance.updateSettings(config)\n  }\n\n  fillIn (data: Map<number, Map<K, T[K]>>) {\n    const { instance } = this\n\n    const changes: [number, string, unknown][] = []\n    for (const [row, props] of data) {\n      for (const [prop, val] of props) {\n        changes.push([instance.toVisualRow(row), prop as string, val])\n      }\n    }\n\n    instance.setDataAtRowProp(changes, FILLIN)\n  }\n}\n\n</script>\n\n<style lang=\"stylus\" scoped>\n.handsontable::v-deep\n  th\n    text-align: left\n    color: var(--hot-header-color)\n    background: var(--hot-header-bg)\n    letter-spacing: 0.8px\n    text-transform: uppercase\n    font-size: 11px\n    font-weight bold\n\n  th,\n  td\n    height: 29px !important\n    line-height: 30px\n    padding: 2px 6px\n    border-color: var(--hot-border-color) !important\n\n  thead th .relative\n    padding: 2px 6px\n\n.handsontableInput\n  line-height: 30px\n  font-size: 14px\n</style>\n",".handsontable::v-deep th {\n  text-align: left;\n  color: var(--hot-header-color);\n  background: var(--hot-header-bg);\n  letter-spacing: 0.8px;\n  text-transform: uppercase;\n  font-size: 11px;\n  font-weight: bold;\n}\n.handsontable::v-deep th,\n.handsontable::v-deep td {\n  height: 29px !important;\n  line-height: 30px;\n  padding: 2px 6px;\n  border-color: var(--hot-border-color) !important;\n}\n.handsontable::v-deep thead th .relative {\n  padding: 2px 6px;\n}\n.handsontableInput {\n  line-height: 30px;\n  font-size: 14px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-70eb19ac";
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
