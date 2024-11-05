export const formatTime = (time: string): string => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

export const validateTimeSlots = (timeSlots: { start_time: string; end_time: string }[]): boolean => {
  if (!timeSlots.length) return true;

  // Sort time slots by start time
  const sortedSlots = [...timeSlots].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  // Check for overlaps
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const currentSlot = sortedSlots[i];
    const nextSlot = sortedSlots[i + 1];

    if (currentSlot.end_time >= nextSlot.start_time) {
      return false;
    }
  }

  return true;
};