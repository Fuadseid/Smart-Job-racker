// home.tsx or page.tsx
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Outlet component for nested routes
function Outlet({ children }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 w-full">
      {children}
    </div>
  );
}

export default function Dashboard({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Protect route - redirect if not authenticated
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && mounted) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, router]);

  // Don't render anything until after mount to prevent hydration mismatch
  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--buttonbg)]"></div>
      </div>
    );
  }

  return (
    <div className={`${geistMono.className} ${geistSans.variable} font-sans bg-black min-h-screen w-full`}>
      <SidebarProvider className="w-full min-h-screen">
        <AppSidebar />
        <SidebarInset className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 w-full bg-black/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-white hover:text-cyan-300" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-white/20"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-white/70 hover:text-cyan-300">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* User info */}
            <div className="ml-auto flex items-center gap-4">
              <span className="text-white/70 text-sm hidden md:block">
                Welcome, {user?.name || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--buttonbg)]/20 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </header>
          
          {/* Outlet for nested content */}
          <Outlet>
            {children}
          </Outlet>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}