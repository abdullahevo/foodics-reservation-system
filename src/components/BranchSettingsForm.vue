<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Reservation Duration (minutes)
      </label>
      <input
        type="number"
        v-model.number="formData.reservation_duration"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700"> Tables </label>
      <select
        v-model="formData.selected_tables"
        multiple
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-4"
      >
        <option v-for="table in allTables" :key="table.id" :value="table.id" class="">
          {{ table.section_name }} - {{ table.name }}
        </option>
      </select>
    </div>

    <div class="space-y-4">
      <div v-for="(schedule, index) in formData.schedules" :key="index">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">
            {{ schedule.day }}
          </label>
          <button
            v-if="index === 0"
            type="button"
            @click="applyToAllDays"
            class="text-sm text-blue-500"
            :disabled="loading"
          >
            Apply to all days
          </button>
        </div>

        <div class="space-y-2 mt-2">
          <time-slot-input
            v-for="(slot, slotIndex) in schedule.time_slots"
            :key="slotIndex"
            v-model="schedule.time_slots[slotIndex]"
            :disabled="loading"
            :has-error="!isValidTimeSlot(slot)"
            @remove="removeTimeSlot(index, slotIndex)"
            @validate="validateSchedule(index)"
          />

          <button
            v-if="schedule.time_slots.length < 3"
            type="button"
            @click="addTimeSlot(index)"
            :disabled="loading"
            class="text-sm text-blue-500"
          >
            Add Time Slot
          </button>
        </div>

        <div v-if="scheduleErrors[index]" class="mt-1 text-sm text-red-600">
          {{ scheduleErrors[index] }}
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Branch, DaySchedule, TimeSlot } from "@/types";
import { Component, Vue, Prop } from "vue-property-decorator";
import TimeSlotInput from "./TimeSlotInput.vue";
import { validateTimeSlot, validateSchedule } from "@/utils/validationUtils";
import { mapState } from "vuex";
import { getDefaultSchedule } from "@/utils/branchUtils";

@Component({
  components: {
    TimeSlotInput,
  },
  computed: {
    ...mapState(["loading"]),
  },
})
export default class BranchSettingsForm extends Vue {
  @Prop({ required: true }) readonly branch!: Branch;

  formData = {
    reservation_duration: 0,
    selected_tables: [] as string[],
    schedules: [] as DaySchedule[],
  };
  scheduleErrors: string[] = [];

  created() {
    this.initializeForm();
  }

  initializeForm() {
    this.formData.reservation_duration = this.branch.reservation_duration;
    this.formData.selected_tables = this.getAllSelectedTableIds();
    this.formData.schedules = this.initializeSchedules();
  }

  get allTables() {
    return this.branch?.sections?.flatMap((section) =>
      section?.tables?.map((table) => ({
        id: table.id,
        name: table.name,
        section_name: section.name,
      }))
    );
  }

  getAllSelectedTableIds(): string[] {
    return this.branch?.sections?.flatMap((section) =>
      section?.tables
        ?.filter((table) => table.accepts_reservations)
        ?.map((table) => table.id)
    );
  }

  initializeSchedules(): DaySchedule[] {
    const days = [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];
    return days?.map((day) => ({
      day,
      time_slots: [],
    }));
  }

  addTimeSlot(dayIndex: number) {
    if (this.formData.schedules[dayIndex].time_slots.length < 3) {
      this.formData.schedules[dayIndex].time_slots.push({
        start_time: "",
        end_time: "",
      });
    }
  }

  removeTimeSlot(dayIndex: number, slotIndex: number) {
    this.formData.schedules[dayIndex].time_slots.splice(slotIndex, 1);
  }

  isValidTimeSlot(slot: TimeSlot): boolean {
    return (
      !slot.start_time ||
      !slot.end_time ||
      validateTimeSlot(slot.start_time, slot.end_time)
    );
  }

  validateSchedule(index: number) {
    const schedule = this.formData.schedules[index];
    const isValid = validateSchedule(schedule);
    this.scheduleErrors[index] = isValid ? "" : "Invalid time slots configuration";
    this.$forceUpdate();
  }

  applyToAllDays() {
    const saturdaySlots = [...this.formData.schedules[0].time_slots];
    this.formData.schedules.forEach((schedule, index) => {
      if (index > 0) {
        schedule.time_slots = JSON.parse(JSON.stringify(saturdaySlots));
      }
    });
  }

  handleSubmit() {
    // Validate all schedules before submitting
    const isValid = this.formData.schedules.every((schedule, index) => {
      this.validateSchedule(index);
      return !this.scheduleErrors[index];
    });

    if (!isValid) {
      return;
    }
    const updatedBranch = {
      ...this.branch,
      reservation_duration: this.formData.reservation_duration,
      sections: this.updateSections(),
      reservation_times: this.transformSchedule(this.formData.schedules),
    };

    this.$emit("save", updatedBranch);
  }
  transformSchedule(schedule) {
    const reservationTimes = {};

    schedule.forEach((daySchedule) => {
      const day = daySchedule.day.toLowerCase();
      const timeSlots = daySchedule.time_slots.map((slot) => [
        slot.start_time,
        slot.end_time,
      ]);
      reservationTimes[day] = timeSlots;
    });

    return reservationTimes;
  }

  updateSections() {
    return this.branch?.sections?.map((section) => ({
      ...section,
      tables: section?.tables?.map((table) => ({
        ...table,
        accepts_reservations: this.formData.selected_tables.includes(table.id),
      })),
    }));
  }
}
</script>
