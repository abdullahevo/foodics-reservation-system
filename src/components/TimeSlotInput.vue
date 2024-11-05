<template>
  <div class="flex items-center space-x-2">
    <div class="relative">
      <input
        type="time"
        v-model="startTime"
        :disabled="disabled"
        class="form-input rounded-md shadow-sm"
        :class="{ 'border-red-500': hasError }"
      />
      <span class="text-sm text-gray-500">Start</span>
    </div>
    <span>-</span>
    <div class="relative">
      <input
        type="time"
        v-model="endTime"
        :disabled="disabled"
        class="form-input rounded-md shadow-sm"
        :class="{ 'border-red-500': hasError }"
      />
      <span class="text-sm text-gray-500">End</span>
    </div>
    <button
      type="button"
      @click="$emit('remove')"
      :disabled="disabled"
      class="text-red-500 hover:text-red-700"
    >
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { validateTimeSlot } from '@/utils/validationUtils';

@Component
export default class TimeSlotInput extends Vue {
  @Prop({ required: true }) readonly value!: { start_time: string; end_time: string };
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop({ default: false }) readonly hasError!: boolean;

  get startTime(): string {
    return this.value.start_time;
  }

  set startTime(value: string) {
    this.$emit('input', { ...this.value, start_time: value });
  }

  get endTime(): string {
    return this.value.end_time;
  }

  set endTime(value: string) {
    this.$emit('input', { ...this.value, end_time: value });
  }

  @Watch('value', { deep: true })
  onValueChange() {
    if (this.startTime && this.endTime) {
      this.$emit('validate', validateTimeSlot(this.startTime, this.endTime));
    }
  }
}
</script>