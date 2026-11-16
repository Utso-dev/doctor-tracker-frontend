"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { en: "Home", slug: "/" },
  { en: "Dashboard", slug: "/dashboard" },
  { en: "Doctors", slug: "/dashboard/doctors" },
  { en: "Patients", slug: "/dashboard/patients" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primaryColor py-3.5 px-4 shadow-sm border-b border-primaryColor/20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-whiteColor/10 flex items-center justify-center text-whiteColor">
            <Activity className="w-5 h-5 text-secondaryColor" />
          </div>
          <span className="text-whiteColor text-xl font-bold tracking-tight">
            Doctor<span className="text-secondaryColor">Tracker</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "hover:text-secondaryColor transition-colors",
                pathname === item.slug ? "text-secondaryColor font-semibold" : "text-whiteColor/80"
              )}
            >
              {item.en}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3 text-sm">
          <Link
            href="/login"
            className="text-whiteColor hover:text-secondaryColor transition-colors font-medium px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/registration"
            className="bg-secondaryColor text-blackColor font-semibold text-xs px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-whiteColor text-2xl p-1 cursor-pointer"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 w-full bg-blackColor/40 backdrop-blur-xs h-screen z-50 transform transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="w-[80%] absolute top-0 p-6 right-0 h-full bg-primaryColor max-w-[300px] flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex w-full justify-between items-center mb-8">
              <Link href="/" className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondaryColor" />
                <span className="text-whiteColor text-lg font-bold">DoctorTracker</span>
              </Link>
              <button
                aria-label="close-menu"
                className="text-whiteColor p-1"
                onClick={() => setMenuOpen(false)}
              >
                <HiX className="text-2xl text-whiteColor" />
              </button>
            </div>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className={cn(
                    "block text-sm py-2 px-3 rounded-lg transition-colors",
                    pathname === item.slug
                      ? "text-secondaryColor bg-whiteColor/10 font-medium"
                      : "text-whiteColor/80 hover:text-whiteColor"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.en}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-whiteColor/10 space-y-2">
            <Link
              href="/login"
              className="block text-center text-whiteColor py-2 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/registration"
              className="block text-center bg-secondaryColor text-blackColor font-semibold text-xs py-2.5 rounded-xl"
              onClick={() => setMenuOpen(false)}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
