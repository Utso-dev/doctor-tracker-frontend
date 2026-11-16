import DoctorDetailsPage from "@/components/Doctors/DoctorDetailsPage";

export const metadata = {
  title: "Doctor Profile & Patients | Doctor Tracker",
};

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DoctorDetailsPage doctorId={id} />;
}
