import { serverFetch } from "@/lib/serverFetch";
import { DashboardStats } from "./dashboard.service";

export async function getDashboardStatsServer(): Promise<{
  data: DashboardStats | null;
  error?: string;
}> {
  return await serverFetch<DashboardStats>("/dashboard/stats");
}
