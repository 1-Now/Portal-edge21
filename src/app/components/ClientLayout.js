"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar/sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // List of routes where the sidebar should not appear
  const noSidebarRoutes = ["/login", "/profile", "/forgot-password", "/edit-profile"];

  // Check if the current path should display the sidebar
  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conditionally render the Sidebar */}
      {showSidebar && <Sidebar />}
      
      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${showSidebar ? 'ml-0' : 'w-full'}`}>
        {children}</div>
    </div>
  );
}
