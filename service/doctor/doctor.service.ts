import { Fetch } from "../../lib/Fetch";

export interface DoctorData {
  _id?: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const DoctorService = {
  // Get all doctors with pagination and filters
  getAll: async (params?: DoctorQueryParams) => {
    return await Fetch.get("/doctors", { params });
  },

  // Get single doctor details with patients
  getById: async (id: string) => {
    return await Fetch.get(`/doctors/${id}`);
  },

  // Create doctor
  create: async (data: Omit<DoctorData, "_id">) => {
    return await Fetch.post("/doctors", data);
  },

  // Update doctor
  update: async (id: string, data: Partial<DoctorData>) => {
    return await Fetch.put(`/doctors/${id}`, data);
  },

  // Delete doctor
  delete: async (id: string) => {
    return await Fetch.delete(`/doctors/${id}`);
  },

  // Get patients for a specific doctor
  getDoctorPatients: async (
    doctorId: string,
    params?: { page?: number; limit?: number; search?: string }
  ) => {
    return await Fetch.get(`/doctors/${doctorId}/patients`, { params });
  },

  // Add patient under a specific doctor
  addPatient: async (doctorId: string, patientData: any) => {
    return await Fetch.post(`/doctors/${doctorId}/patients`, patientData);
  },

  // Delete patient from a doctor's list
  deletePatient: async (doctorId: string, patientId: string) => {
    return await Fetch.delete(`/doctors/${doctorId}/patients/${patientId}`);
  },

  // Get distinct specializations created for doctors
  getSpecializations: async () => {
    return await Fetch.get("/doctors/specializations");
  },
};
