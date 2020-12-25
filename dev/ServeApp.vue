<script lang="ts">
import Vue from 'vue';
import Stand from './Stand';

export default Vue.extend({
  name: 'ServeApp',
  components: {
    Stand
  }
});
</script>

<template>
  <div id="app">
    <stand />
  </div>
</template>
