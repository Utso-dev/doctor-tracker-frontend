import { Fetch } from "../../lib/Fetch";

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  averagePatientsPerDoctor: number;
  patientsPerDoctor: {
    _id: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }[];
  dateBasedStats: {
    date: string;
    count: number;
  }[];
  conditionStats: {
    condition: string;
    count: number;
  }[];
}

export const DashboardService = {
  getStats: async () => {
    return await Fetch.get("/dashboard/stats");
  },
};
