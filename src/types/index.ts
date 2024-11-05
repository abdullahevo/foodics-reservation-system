export interface Branch {
  id: string;
  name: string;
  reference: string;
  accepts_reservations: boolean;
  reservation_duration: number;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  accepts_reservations: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface DaySchedule {
  day: string;
  time_slots: TimeSlot[];
}