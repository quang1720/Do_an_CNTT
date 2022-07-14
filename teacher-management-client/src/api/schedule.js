import { axiosClient } from "./axios";

export const getMySchedules = () => axiosClient.get("/api/schedules/teachers");
