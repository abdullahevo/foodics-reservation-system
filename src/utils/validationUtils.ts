import { DaySchedule } from '@/types';

export const validateTimeSlot = (start: string, end: string): boolean => {
  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);
  return startTime < endTime;
};

export const validateSchedule = (schedule: DaySchedule): boolean => {
  if (!schedule.time_slots.length) return true;

  // Check each time slot is valid
  const validSlots = schedule.time_slots.every(slot =>
    validateTimeSlot(slot.start_time, slot.end_time)
  );

  if (!validSlots) return false;

  // Check for overlapping slots
  const sortedSlots = [...schedule.time_slots].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const currentSlot = sortedSlots[i];
    const nextSlot = sortedSlots[i + 1];

    if (currentSlot.end_time >= nextSlot.start_time) {
      return false;
    }
  }

  return true;
};