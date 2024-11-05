import { formatTime } from "@/utils/timeUtils";
import { DaySchedule } from '@/types';


export const formatBranchSchedule = (schedules: DaySchedule[]): string => {
  if (!schedules.length) return 'No schedule set';

  return schedules
    .map(schedule => {
      const slots = schedule.time_slots
        .map(slot => `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`)
        .join(', ');
      return `${schedule.day}: ${slots || 'Closed'}`;
    })
    .join('\n');
};

export const getDefaultSchedule = (): DaySchedule[] => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days.map(day => ({
    day,
    time_slots: []
  }));
};