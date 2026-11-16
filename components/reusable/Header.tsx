"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdNotifications } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useUser } from "@/hooks/useUser";
import { UserService } from "@/service/user/user.service";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    UserService.logout();
    router.push("/login");
  };

  return (
    <nav className="text-headerColor border-b bg-whiteColor border-borderColor py-3">
      <div className="px-4 md:px-6 relative flex justify-between items-center w-full z-50">
        {/* Mobile menu button */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 text-headerColor hover:bg-bgColor rounded-lg cursor-pointer transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Portal title */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-headerColor">
            Doctor & Patient Management System
          </h1>
        </div>

        {/* Notification and Profile Group */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications Popover */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative p-2 rounded-lg text-descriptionColor hover:bg-bgColor transition-colors"
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              <span className="absolute top-1.5 right-1.5 flex justify-center items-center text-[10px] w-4 h-4 text-whiteColor rounded-full bg-redColor font-bold">
                1
              </span>
              <MdNotifications size={22} className="text-headerColor" />
            </PopoverTrigger>

            <PopoverContent className="w-72 mt-2 p-0 flex flex-col shadow-lg border border-borderColor bg-whiteColor">
              <div className="flex justify-between items-center p-4 border-b border-borderColor">
                <h4 className="text-sm font-bold text-headerColor">Notifications</h4>
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="text-grayColor1 hover:text-headerColor cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 text-xs text-descriptionColor">
                <div className="p-2 bg-blueColor/15 text-blueColor rounded-lg font-medium">
                  Welcome to Doctor Tracker! System is ready and connected.
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center cursor-pointer p-1.5 rounded-xl hover:bg-bgColor transition-colors">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-primaryColor flex items-center justify-center text-whiteColor font-bold text-sm shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-headerColor leading-tight">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[11px] text-grayColor1 leading-tight capitalize">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <IoIosArrowDown size={14} className="text-grayColor1" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1 bg-whiteColor border border-borderColor">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-headerColor">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-descriptionColor truncate">
                  {user?.email || "admin@doctortracker.com"}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-borderColor" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-redColor focus:text-redColor focus:bg-redColor/10 font-medium cursor-pointer rounded-lg"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
