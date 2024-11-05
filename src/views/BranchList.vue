<template>
  <div>
     <BranchList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BranchList from '@/components/BranchList.vue';

export default Vue.extend({
  name: 'HomeView',
  components: {
    BranchList,
  },
});
</script>
