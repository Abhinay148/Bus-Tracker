import { Stop, Van } from "./types";

export const ME_STOP_ID = "lake";
export const ME_STUDENT_ID = "s4";

export const INITIAL_ROUTE: Stop[] = [
  {
    id: "home",
    name: "Home Colony",
    students: [{ id: "s1", name: "Isha Rao", color: "#2E9E6D" }],
  },
  {
    id: "park",
    name: "Park Avenue",
    students: [
      { id: "s2", name: "Kabir Sen", color: "#E8912B" },
      { id: "s3", name: "Diya Nair", color: "#3E7CB1" },
    ],
  },
  {
    id: "lake",
    name: "Lake View Colony",
    students: [{ id: "s4", name: "Aarav Mehta", color: "#8A5CF6", isMe: true }],
  },
  {
    id: "market",
    name: "Market Square",
    students: [
      { id: "s5", name: "Nyra Kapoor", color: "#D64545" },
      { id: "s6", name: "Vihaan Joshi", color: "#2E9E6D" },
    ],
  },
  {
    id: "school",
    name: "Greenwood School",
    students: [],
  },
];

export const INITIAL_VANS: Van[] = [
  {
    id: "GS-04",
    stops: ["Home Colony", "Park Avenue", "Lake View Colony", "Market Square", "Greenwood School"],
  },
  {
    id: "GS-07",
    stops: ["Cedar Heights", "Riverside Road", "Greenwood School"],
  },
];
