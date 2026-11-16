import DoctorsManagement from "@/components/Doctors/DoctorsManagement";

export const metadata = {
  title: "Doctors Management | Doctor Tracker",
};

interface DoctorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const resolvedParams = await searchParams;
  return <DoctorsManagement searchParams={resolvedParams} />;
}
