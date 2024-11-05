<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black opacity-50"></div>

      <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-medium">
            <slot name="header"></slot>
          </h3>
        </div>

        <div class="px-6 py-4">
          <slot name="body"></slot>
        </div>

        <div class="px-6 py-4 border-t flex justify-end space-x-4">
          <button
            @click="$emit('close')"
            class="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {}
</script>