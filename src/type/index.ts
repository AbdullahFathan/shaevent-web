interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FlashEvent {
  id: number;
  name: string;
  location: string;
  startDate: string;
  tickets: Tickets[];
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export interface Tickets {
  price: string;
  remainingQuota: number;
  ticketType: string;
}

export interface CreateEventTicketData {
  id: number;
  eventId: number;
  price: string;
  ticketType: string;
  createdAt: string;
  quota: number;
  remainingQuota: number;
  version: number;
}

export interface CreateEventResponseData {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  tickets: CreateEventTicketData[];
}

export type CreateEventResponse = BaseResponse<CreateEventResponseData>;

