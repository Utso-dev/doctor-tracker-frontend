import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Stethoscope,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgColor">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-whiteColor border border-borderColor text-xs font-semibold text-primaryColor shadow-xs">
            <Activity className="w-3.5 h-3.5 text-secondaryColor" />
            <span>Doctor Tracker & Patient Management System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-headerColor tracking-tight leading-tight">
            Intelligent Healthcare Administration &{" "}
            <span className="text-primaryColor underline decoration-secondaryColor decoration-wavy">
              Patient Analytics
            </span>
          </h1>

          <p className="text-base sm:text-lg text-descriptionColor max-w-2xl mx-auto leading-relaxed">
            Doctor Tracker is a secure administrative web application enabling medical
            teams to oversee doctors, monitor patient conditions, and derive actionable
            insights through real-time data visualization.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primaryColor text-whiteColor font-medium text-sm sm:text-base hover:opacity-95 shadow-lg shadow-primaryColor/25 transition-all cursor-pointer"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-4 h-4 text-secondaryColor" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-borderColor bg-whiteColor text-headerColor font-medium text-sm sm:text-base hover:bg-bgColor transition-all shadow-xs cursor-pointer"
            >
              <span>Login to Portal</span>
            </Link>
          </div>

          {/* Features highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <div className="p-6 rounded-2xl bg-whiteColor border border-borderColor shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blueColor/10 text-blueColor flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-headerColor mb-1">
                Doctor Management
              </h3>
              <p className="text-xs text-descriptionColor leading-relaxed">
                Register medical specialists, track affiliations, filter by clinical
                specialization, and oversee patient assignments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-whiteColor border border-borderColor shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-greenColor/15 text-greenColor flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-headerColor mb-1">
                Patient Tracking
              </h3>
              <p className="text-xs text-descriptionColor leading-relaxed">
                Maintain comprehensive patient registries with health conditions (Stable,
                Critical, Recovered, Under Treatment) and doctor links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-whiteColor border border-borderColor shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orengeColor/15 text-orengeColor flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-headerColor mb-1">
                Visual Analytics
              </h3>
              <p className="text-xs text-descriptionColor leading-relaxed">
                MongoDB aggregation pipelines driving responsive Bar, Doughnut, and Line
                charts for high-performance visual insights.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
