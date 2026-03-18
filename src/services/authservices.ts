import { axiosInstance } from "../lib/axios";

export const AuthService = {
  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
  },
};
