<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Restaurant Reservation System</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <error-alert
        v-if="error"
        :message="error"
        @dismiss="clearError"
      />
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import ErrorAlert from '@/components/ErrorAlert.vue';

@Component({
  components: {
    ErrorAlert
  },
  computed: {
    ...mapState(['error'])
  }
})
export default class App extends Vue {
  clearError() {
    this.$store.commit('SET_ERROR', null);
  }
}
</script>