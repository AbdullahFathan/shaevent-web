import { axiosInstance } from "../lib/axios";
import { CreateEventResponse } from "@/type";
import { EventForm } from "@/schema/eventSchema";

export const EventService = {
  getAllEvents: async () => {
    const response = await axiosInstance.get("/events");
    return response.data;
  },

  createEvent: async (data: FormData): Promise<CreateEventResponse> => {
    const response = await axiosInstance.post<CreateEventResponse>(
      "/events",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
