import PatientsManagement from "@/components/Patients/PatientsManagement";

export const metadata = {
  title: "Patients Management | Doctor Tracker",
};

interface PatientsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PatientsPage({
  searchParams,
}: PatientsPageProps) {
  const resolvedParams = await searchParams;
  return <PatientsManagement searchParams={resolvedParams} />;
}
