import { axiosClient } from "./axios";

export const addTeacher = (values) =>
  axiosClient.post("/api/admin/teachers", {
    ...values,
    role:"teacher"
  });

export const getTeachers = () => axiosClient.get("/api/admin/teachers");

export const getSchedules = () => axiosClient.get("/api/schedules");

export const patchSchedules = (values, id) =>
  axiosClient.patch(`/api/schedules/${id}`, values);

export const deleteSchedules = (id) =>
  axiosClient.delete(`/api/schedules/${id}`);
