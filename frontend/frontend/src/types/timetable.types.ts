export interface Timetable {

  id: string;

  teacher_id: string;

  day: string;

  start_time: string;

  end_time: string;

  subject: string;

  room: string;

  created_at?: string;

  updated_at?: string;
}


export interface CreateTimetableRequest {

  day: string;

  start_time: string;

  end_time: string;

  subject: string;

  room: string;
}


export interface UpdateTimetableRequest {

  day?: string;

  start_time?: string;

  end_time?: string;

  subject?: string;

  room?: string;
}