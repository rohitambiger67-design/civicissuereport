export type IssueCategory =
  | "roads"
  | "drainage"
  | "garbage"
  | "streetlights"
  | "water"
  | "encroachment"
  | "other";

export type IssueStatus = "pending" | "inProgress" | "resolved";

export interface Issue {
  id: string;
  imageUrl: string;
  category: IssueCategory;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: IssueStatus;
  likes: number;
  reports: number;
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  category: IssueCategory;
  name: string;
  contact: string;
}

export const departments: Department[] = [
  { category: "roads", name: "Roads & Infrastructure Dept.", contact: "roads@hdmc.gov.in" },
  { category: "drainage", name: "Drainage & Sewage Dept.", contact: "drainage@hdmc.gov.in" },
  { category: "garbage", name: "Solid Waste Management", contact: "swm@hdmc.gov.in" },
  { category: "streetlights", name: "Electrical Division", contact: "electrical@hdmc.gov.in" },
  { category: "water", name: "Water Supply Dept.", contact: "water@hdmc.gov.in" },
  { category: "encroachment", name: "Town Planning Dept.", contact: "planning@hdmc.gov.in" },
  { category: "other", name: "General Administration", contact: "admin@hdmc.gov.in" },
];
