import { axiosInstance } from "../lib/axios";
import { CreateEventResponse } from "@/type";
import { EventForm } from "@/schema/eventSchema";

export const EventService = {
  getAllEvents: async () => {
    const response = await axiosInstance.get("/events");
    return response.data;
  },

  createEvent: async (data: EventForm): Promise<CreateEventResponse> => {
    const response = await axiosInstance.post<CreateEventResponse>("/events", data);
    return response.data;
  },
};
