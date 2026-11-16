"use client";

import { CookieHelper } from "@/helper/cookie.helper";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Stethoscope,
    label: "Doctors",
    href: "/dashboard/doctors",
  },
  {
    icon: Users,
    label: "Patients",
    href: "/dashboard/patients",
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    CookieHelper.destroy({ key: "token" });
    CookieHelper.destroy({ key: "accessToken" });
    router.push("/login");
  };

  return (
    <div className="h-screen bg-whiteColor flex flex-col justify-between border-r border-borderColor shadow-xs">
      {/* Sidebar container */}
      <div
        className={`
          ${isOpen ? "z-50 h-full w-full absolute top-0 left-0 bg-whiteColor" : "h-full"}
          flex flex-col justify-between
          p-4 overflow-y-auto transition-all duration-300
        `}
      >
        <div>
          {/* Header with Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-borderColor mb-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primaryColor flex items-center justify-center text-whiteColor shadow-sm">
                <Activity className="w-6 h-6 text-secondaryColor" />
              </div>
              <div>
                <h2 className="text-primaryColor text-xl font-bold tracking-tight leading-none">
                  Doctor<span className="text-secondaryColor">Tracker</span>
                </h2>
                <span className="text-xs text-grayColor1 font-medium uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="xl:hidden bg-bgColor hover:bg-bgColor/80 text-primaryColor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-grayColor1 uppercase tracking-wider px-3 mb-2">
              Navigation
            </p>
            {navItems.map((item, idx) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? "bg-primaryColor text-whiteColor shadow-sm shadow-primaryColor/20"
                      : "text-descriptionColor hover:text-primaryColor hover:bg-bgColor"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${active ? "text-secondaryColor scale-110" : "text-grayColor1"
                      }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Log out section */}
        <div className="pt-4 border-t border-borderColor">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium text-redColor hover:bg-redColor/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
