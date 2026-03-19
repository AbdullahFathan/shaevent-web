import { axiosInstance } from "../lib/axios";

export const EventService = {
  getAllEvents: async () => {
    const response = await axiosInstance.get("/events");
    return response.data;
  },

  createEvent: async (data: any) => {
    const response = await axiosInstance.post("/events", data);
    return response.data;
  },
};
