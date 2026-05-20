import axios from "@/lib/axios";

// CREATE TEACHER TIMETABLE

export const createTeacherTimetable = async (data: any) => {
  const response = await axios.post(
    "/teacher/timetable",
    data
  );

  return response.data;
};

// GET TEACHER TIMETABLE

export const getTeacherTimetable = async () => {

  const response =
    await axios.get(
      "/teacher/timetable"
    );

  return (
    response.data.data || []
  );
};

// UPDATE TEACHER TIMETABLE

export const updateTeacherTimetable = async (
  id: string,
  data: any
) => {
  const response = await axios.put(
    `/teacher/timetable/${id}`,
    data
  );

  return response.data;
};