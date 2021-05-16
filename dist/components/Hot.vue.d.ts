import Vue from "vue";
import Handsontable from "handsontable";
import CellValue = Handsontable.CellValue;
import RowObject = Handsontable.RowObject;
import CellChange = Handsontable.CellChange;
import ChangeSource = Handsontable.ChangeSource;
declare type Value = CellValue[][] | RowObject[];
declare const FILLIN = "fillIn";
declare const _default: import("vue/types/vue").ExtendedVue<Vue, unknown, {
    instance(): Handsontable;
    hot(): HTMLElement;
    requestRender(): void;
    hackyRender(): void;
    hackyRenderSecondRun(): void;
    change(changes: CellChange[] | null, source: ChangeSource | typeof FILLIN): void;
    fillIn<K extends string, V>(data: Map<number, Map<K, V>>): void;
}, {
    staticConfig: Handsontable.GridSettings;
}, {
    licenseKey: string;
    columns: Handsontable.ColumnSettings[];
    value: Value;
    dataSchema: Handsontable.RowObject | undefined;
    readOnly: boolean;
    emptyCol: boolean;
    stretchLast: boolean;
}>;
export default _default;
