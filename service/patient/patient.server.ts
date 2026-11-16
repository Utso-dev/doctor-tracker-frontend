import { serverFetch } from "@/lib/serverFetch";
import { PatientData, PatientQueryParams } from "./patient.service";

export interface PatientsServerResponse {
  data: PatientData[] | null;
  error?: string;
  status: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPatientsServer(
  params?: PatientQueryParams
): Promise<PatientsServerResponse> {
  return await serverFetch<PatientData[]>("/patients", { params });
}
