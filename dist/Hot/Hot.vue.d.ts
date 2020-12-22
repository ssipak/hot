import { Vue } from 'vue-property-decorator';
import Handsontable from 'handsontable';
import GridSettings = Handsontable.GridSettings;
import CellValue = Handsontable.CellValue;
import RowObject = Handsontable.RowObject;
import ColumnSettings = Handsontable.ColumnSettings;
import CellChange = Handsontable.CellChange;
import ChangeSource = Handsontable.ChangeSource;
declare type Value = CellValue[][] | RowObject[];
declare const FILLIN = "fillIn";
export default class Hot<T, K extends keyof T> extends Vue {
    licenseKey: string;
    columns: ColumnSettings[];
    value: Value;
    dataSchema: RowObject | undefined;
    readOnly: boolean;
    readonly hot: HTMLElement;
    mounted(): void;
    beforeDestroy(): void;
    get instance(): Handsontable;
    get staticConfig(): GridSettings;
    requestRender(): void;
    private hackyRender;
    private hackyRenderSecondRun;
    change(changes: CellChange[] | null, source: ChangeSource | typeof FILLIN): void;
    watchValue(value: Value): void;
    watchConfig(config: GridSettings): void;
    fillIn(data: Map<number, Map<K, T[K]>>): void;
}
export {};
