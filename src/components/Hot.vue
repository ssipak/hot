<template>
  <div ref="hot" class="hot-mount"/>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import Handsontable from 'handsontable';
import { range, debounce, deepCopy, deepEqual } from '@/utils';
import GridSettings = Handsontable.GridSettings;
import CellValue = Handsontable.CellValue;
import RowObject = Handsontable.RowObject;
import ColumnSettings = Handsontable.ColumnSettings;
import CellChange = Handsontable.CellChange;
import ChangeSource = Handsontable.ChangeSource;

type WrapFn = () => void;
type Value = CellValue[][] | RowObject[];

const instances = new WeakMap<Vue, Handsontable>();
const renderers = new WeakMap<Element, WrapFn>();

const resizeObserver = new ResizeObserver(wraps =>
  wraps.forEach(({ target }) => renderers.get(target)?.())
);

const FILLIN = 'fillIn';

@Component({ name: 'Hot' })
export default class Hot<T, K extends keyof T> extends Vue {
  @Prop({ type: String, required: true }) public licenseKey!: string;
  @Prop({ type: Array, required: true }) public columns!: ColumnSettings[];
  @Prop({ type: Array, default: () => [] }) value!: Value;
  @Prop({ type: Object }) dataSchema: RowObject | undefined;
  @Prop({ type: Boolean, default: false }) readOnly!: boolean;
  @Prop({ type: Boolean, default: false }) emptyCol!: boolean;
  @Prop({ type: Boolean, default: true }) stretchLast!: boolean;

  @Ref() readonly hot!: HTMLElement;

  mounted (): void {
    const instance = new Handsontable(this.hot, this.staticConfig);
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

  // noinspection JSUnusedGlobalSymbols
  beforeDestroy (): void {
    instances.delete(this);
    const parentEl = this.hot.parentElement;
    if (parentEl) {
      renderers.delete(parentEl);
      resizeObserver.unobserve(parentEl);
    }
  }

  get instance (): Handsontable {
    return instances.get(this) as Handsontable;
  }

  get staticConfig (): GridSettings {
    let { columns } = this;

    if (this.readOnly) {
      columns = columns.map(col => ({ editor: false, ...col }));
    }

    if (this.emptyCol) {
      columns.push({ data: '', title: ' ', readOnly: true });
    }

    const config: GridSettings = {
      columns,
      dataSchema: this.dataSchema,
      autoColumnSize: true,
      manualColumnResize: true,
      autoWrapRow: true,
      stretchH: this.stretchLast ? 'last' : 'all',
      licenseKey: this.licenseKey,
      preventOverflow: 'vertical'
    };

    if (this.readOnly) {
      config.beforePaste = () => false;
    }

    return config;
  }

  public requestRender (): void {
    const parentEl = this.hot.parentElement;

    if (parentEl) {
      renderers.get(parentEl)?.();
    }
  }

  private hackyRender (): void {
    const { instance } = this;

    instance.updateSettings({ height: 'auto' });
    instance.render();

    this.hackyRenderSecondRun();
  }

  private hackyRenderSecondRun (): void {
    const parentEl = this.hot.parentElement;

    if (parentEl) {
      const {
        height,
        paddingTop,
        paddingBottom,
        boxSizing
      } = window.getComputedStyle(parentEl);

      let contentHeight = parseFloat(height);
      if (boxSizing === 'border-box') {
        contentHeight -= parseFloat(paddingTop) + parseFloat(paddingBottom);
      }

      const { instance } = this;

      instance.updateSettings({ height: contentHeight });
      instance.render();
    }
  }

  change (changes: CellChange[] | null, source: ChangeSource | typeof FILLIN): void {
    const { instance } = this;

    const sourceData = instance.getSourceData();

    if (!deepEqual(sourceData, this.value)) {
      this.$emit('input', sourceData);
    }

    if (source === FILLIN || changes === null) {
      return;
    }

    this.$emit(
      'change',
      changes.map(([row, prop, oldVal, newVal]) => [
        instance.toPhysicalRow(row),
        prop,
        oldVal as unknown,
        newVal as unknown
      ])
    );
  }

  @Watch('value') watchValue (value: Value): void {
    const { instance } = this;
    instance.updateSettings({ height: 'auto' });
    instance.loadData(deepCopy(value));
    instance.validateRows([...range(0, value.length)]);
    this.hackyRenderSecondRun();
  }

  @Watch('staticConfig') watchConfig (config: GridSettings): void {
    this.instance.updateSettings(config);
  }

  fillIn (data: Map<number, Map<K, T[K]>>): void {
    const { instance } = this;

    const changes: [number, string, unknown][] = [];
    for (const [row, props] of data) {
      for (const [prop, val] of props) {
        changes.push([instance.toVisualRow(row), prop as string, val]);
      }
    }

    instance.setDataAtRowProp(changes, FILLIN);
  }
}
</script>

<style lang="stylus" scoped>
.handsontable::v-deep
  th
    text-align: left
    color: var(--hot-header-color)
    background: var(--hot-header-bg)
    letter-spacing: 0.8px
    text-transform: uppercase
    font-size: 11px
    font-weight bold

  th,
  td
    height: 29px !important
    line-height: 30px
    padding: 2px 6px
    border-color: var(--hot-border-color) !important

  thead th .relative
    padding: 2px 6px

.handsontableInput
  line-height: 30px
  font-size: 14px
</style>
