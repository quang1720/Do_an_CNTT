import { axiosClient } from "./axios";

export const addSchedule = (values) =>
  axiosClient.post("/api/schedules", values);

export const getScheduleById = (id) =>
  axiosClient.get(`/api/schedules/teachers/${id}`);
