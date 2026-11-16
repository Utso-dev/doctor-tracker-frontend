"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primaryColor text-whiteColor px-4 border-t border-primaryColor/40">
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-whiteColor/10 flex items-center justify-center text-whiteColor">
              <Activity className="w-6 h-6 text-secondaryColor" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Doctor<span className="text-secondaryColor">Tracker</span>
              </h2>
              <p className="text-xs text-whiteColor/80">
                Healthcare administration & patient monitoring platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-whiteColor/80">
            <Link href="/" className="hover:text-secondaryColor transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-secondaryColor transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/doctors" className="hover:text-secondaryColor transition-colors">
              Doctors
            </Link>
            <Link href="/dashboard/patients" className="hover:text-secondaryColor transition-colors">
              Patients
            </Link>
            <Link href="/login" className="hover:text-secondaryColor transition-colors">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-whiteColor/10 flex flex-col sm:flex-row items-center justify-between text-xs text-whiteColor/60 gap-4">
          <p>© {new Date().getFullYear()} Doctor Tracker. All rights reserved.</p>
          <p>Built with Next.js, Express & MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
