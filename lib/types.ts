export type ResponseStatus = "leaving" | "arrived" | "delayed" | "noshow";
export type StopStatus = "pending" | "notified" | "leaving" | "arrived" | "delayed" | "noshow";

export interface Student {
  id: string;
  name: string;
  color: string;
  isMe?: boolean;
}

export interface Stop {
  id: string;
  name: string;
  students: Student[];
}

export interface Van {
  id: string;
  stops: string[];
}

export interface StopState {
  status: StopStatus;
  notifCount: number;
  secondsLeft: number;
  perStudent: Record<string, ResponseStatus | undefined>;
}
