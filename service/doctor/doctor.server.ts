import { serverFetch } from "@/lib/serverFetch";
import { DoctorData, DoctorQueryParams } from "./doctor.service";
import { PatientData } from "../patient/patient.service";

export interface DoctorsServerResponse {
  data: DoctorData[] | null;
  error?: string;
  status: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getDoctorsServer(
  params?: DoctorQueryParams
): Promise<DoctorsServerResponse> {
  return await serverFetch<DoctorData[]>("/doctors", { params });
}

export async function getDoctorSpecializationsServer(): Promise<string[]> {
  const res = await serverFetch<string[]>("/doctors/specializations");
  return res.data || [];
}

export async function getDoctorByIdServer(
  id: string
): Promise<DoctorData | null> {
  const res = await serverFetch<DoctorData>(`/doctors/${id}`);
  return res.data;
}

export async function getDoctorPatientsServer(
  doctorId: string,
  params?: { search?: string; page?: number; limit?: number }
): Promise<PatientData[]> {
  const res = await serverFetch<PatientData[]>(`/doctors/${doctorId}/patients`, {
    params,
  });
  return res.data || [];
}
