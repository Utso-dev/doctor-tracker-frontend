import { Fetch } from "../../lib/Fetch";

export interface PatientData {
  _id?: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  condition: "Stable" | "Critical" | "Recovered" | "Under Treatment";
  doctor: any; // ID or populated Doctor object
  phone: string;
  email?: string;
  address?: string;
  admissionDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const PatientService = {
  // Get all patients with pagination, search, and condition/date filters
  getAll: async (params?: PatientQueryParams) => {
    return await Fetch.get("/patients", { params });
  },

  // Get single patient details
  getById: async (id: string) => {
    return await Fetch.get(`/patients/${id}`);
  },

  // Create patient
  create: async (data: Omit<PatientData, "_id">) => {
    return await Fetch.post("/patients", data);
  },

  // Update patient
  update: async (id: string, data: Partial<PatientData>) => {
    return await Fetch.put(`/patients/${id}`, data);
  },

  // Delete patient
  delete: async (id: string) => {
    return await Fetch.delete(`/patients/${id}`);
  },
};
