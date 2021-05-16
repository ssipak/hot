<template>
  <div class="stand">
    <h1>{{ title }}</h1>
    <div class="param">
      <label v-for="([val, label], i) in valueSetOptions" :key="i">
        <input type="radio" v-model="withShortValue" :value="val"/>
        {{ label }}
      </label>
    </div>
    <div class="param">
      <label v-for="([val, label], i) in modes" :key="i">
        <input type="radio" v-model="mode" :value="val"/>
        {{ label }}
      </label>
    </div>
    <div class="container" :class="cls">
      <hot ref="hot" license-key="non-commercial-and-evaluation" :columns="columns" :value="value"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Hot from '../src/components/Hot';
import { dataFaker } from './lib/data-faker';
import { take } from './lib/take';

const columns = [
  { data: 'given', title: 'Given' },
  { data: 'family', title: 'lib' },
  { data: 'patronymic', title: 'Patronymic' }
];

const fields = columns.map(c => c.data);
const shortValue = [...take(dataFaker(fields, 1000), 10)];
const longValue = [...take(dataFaker(fields, 1000), 40)];

export default Vue.extend({
  name: 'Stand',

  components: { Hot },

  data () {
    return {
      mode: 'a',
      withShortValue: true
    };
  },

  computed: {
    title () {
      return 'Let\'s test HOT';
    },

    cls () {
      return `container-${this.mode}`;
    },

    columns () {
      return columns;
    },

    value () {
      return this.withShortValue ? shortValue : longValue;
    },

    valueSetOptions () {
      return [[true, 'Short'], [false, 'Long']];
    },

    modes () {
      return [
        ['a', 'no height'],
        ['b', 'max-height'],
        ['c', 'fixed height']
      ];
    }
  },

  watch: {
    mode () {
      this.$refs.hot.requestRender();
    }
  }
});
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
