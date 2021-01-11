<template>
  <div class="stand">
    <h1>{{ title }}</h1>
    <div class="param">
      <label v-for="[val, label] in valueSetOptions">
        <input type="radio" v-model="withShortValue" :value="val" />
        {{ label }}
      </label>
    </div>
    <div class="param">
      <label v-for="[val, label] in modes">
        <input type="radio" v-model="mode" :value="val" />
        {{ label }}
      </label>
    </div>
    <div class="container" :class="cls">
      <hot ref="hot" license-key="non-commercial-and-evaluation" :columns="columns" :value="value" />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
import Hot from '../src/components/Hot'
import {dataFaker} from "./lib/data-faker";
import {take} from "./lib/take";

const columns = [
  {data: 'given', title: 'Given'},
  {data: 'family', title: 'lib'},
  {data: 'patronymic', title: 'Patronymic'}
]

const fields = columns.map(c => c.data)
const shortValue = [...take(dataFaker(fields, 1000), 10)]
const longValue = [...take(dataFaker(fields, 1000), 40)]

@Component({components: {Hot}})
export default class Stand extends Vue {
  @Ref readonly hot!: Hot

  mode = 'a'
  withShortValue = true

  get title() {
    return 'Let\'s test HOT'
  }

  get cls() {
    return `container-${this.mode}`
  }

  get columns() {
    return columns
  }

  get value() {
    return this.withShortValue ? shortValue : longValue
  }

  get valueSetOptions() {
    return [[true, 'Short'], [false, 'Long']]
  }

  get modes() {
    return [
      ['a', 'no height'],
      ['b', 'max-height'],
      ['c', 'fixed height'],
    ]
  }
  @Watch('mode') onModeChange() {
    this.hot.requestRender();
  }
}
</script>

<style scoped>
@import "~handsontable/dist/handsontable.full.css";

.stand {
  display: flex;
  flex-flow: column;
  align-items: center;
}

h1, h2 {
  font-weight: normal;
}

.param {
  padding-bottom: 10px;
}

.container {
  width: 50vw;
  padding: 40px;
  border-radius: 5px;
  background: #3A91CF;
}

.container-a {

}

.container-b {
  max-height: 50vh;
}

.container-c {
  height: 50vh;
}

</style>
