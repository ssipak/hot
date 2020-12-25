<template>
  <div class="stand">
    <h1>{{ msg }}</h1>
    <div class="param">
      <label v-for="[val, lbl] in [[true, 'Short'], [false, 'Long']]">
        <input type="radio" v-model="withShortValue" :value="val" />
        {{ lbl }}
      </label>
    </div>
    <div class="param">
      <label v-for="[m, lbl] in modes">
        <input type="radio" v-model="mode" :value="m" />
        {{ lbl }}
      </label>
    </div>
    <div class="container" :class="cls">
      <hot ref="hot" license-key="non-commercial-and-evaluation" :columns="columns" :value="value" />
    </div>
  </div>
</template>

<script>
import Hot from '../src/Hot/Hot'
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

export default {
  components: {Hot},
  name: 'Stand',
  data() {
    return {
      msg: 'Let\'s test HOT',
      mode: 'a',
      withShortValue: true,
    }
  },
  computed: {
    cls() {
      return `container-${this.mode}`
    },
    columns() {
      return columns
    },
    value() {
      return this.withShortValue ? shortValue : longValue
    },
    modes() {
      return [
        ['a', 'no height'],
        ['b', 'max-height'],
        ['c', 'fixed height'],
      ]
    }
  },
  watch: {
    mode() {
      this.$refs.hot.requestRender();
    },
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
