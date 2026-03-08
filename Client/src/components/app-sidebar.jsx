import * as React from "react";
import {
  BadgeDollarSign,
  ChartBar,
  Eye,
  File,
  GalleryVerticalEnd,
  LayoutDashboard,
  Mic,
  Minus,
  Plus,
  Save,
  ToolCase,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Applications",
      url: "/dashboard/applications",
      icon: File,
    },
    {
      title: "Saved Jobs",
      url: "/dashboard/saved-jobs",
      icon: Save,
    },
    {
      title: "Interviews",
      url: "/dashboard/interviews",
      icon: Mic,
    },
    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: BadgeDollarSign,
    },
    {
      title: "Tracking",
      url: "/dashboard/tracking",
      icon: ChartBar,
      items: [
        {
          title: "Job Pipeline",
          url: "/dashboard/tracking/pipeline",
        },
        {
          title: "Application Status",
          url: "/dashboard/tracking/status",
        },
        {
          title: "Notes",
          url: "/dashboard/tracking/notes",
        },
        {
          title: "Activity Log",
          url: "/dashboard/tracking/activity",
        }
      ],
    },
    {
      title: "Tools",
      url: "/dashboard/tools",
      icon: ToolCase,
      items: [
        {
          title: "Resume Manager",
          url: "/dashboard/tools/resume",
        },
        {
          title: "Cover Letters",
          url: "/dashboard/tools/cover-letters",
        },
        {
          title: "Documents",
          url: "/dashboard/tools/documents",
        },
      ],
    },
    {
      title: "Insights",
      url: "/dashboard/insights",
      icon: Eye,
      items: [
        {
          title: "Analytics",
          url: "/dashboard/insights/analytics",
        },
        {
          title: "Progress Report",
          url: "/dashboard/insights/progress",
        },
        {
          title: "Weekly Summary",
          url: "/dashboard/insights/weekly",
        },
      ],
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: User,
      items: [
        {
          title: "Profile",
          url: "/dashboard/account/profile",
        },
        {
          title: "Settings",
          url: "/dashboard/account/settings",
        },
        {
          title: "Logout",
          url: "/dashboard/account/logout",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const [openCollapsibles, setOpenCollapsibles] = React.useState({});

  // Function to check if a specific URL is exactly active
  const isUrlExactlyActive = (url) => {
    return router.pathname === url;
  };

  // Function to check if a parent should be highlighted (when on a child route)
  const isParentActive = (item) => {
    if (!item.items) return false;
    
    // Check if any child is active
    return item.items.some(subItem => router.pathname === subItem.url) ||
           (router.pathname.startsWith(item.url + "/") && item.url !== "/dashboard");
  };

  // Function to determine if an item should be active
  const isItemActive = (item) => {
    if (item.items) {
      // For items with children, highlight if on the exact URL or if parent of current route
      return isUrlExactlyActive(item.url) || isParentActive(item);
    } else {
      // For items without children, only highlight on exact match
      return isUrlExactlyActive(item.url);
    }
  };

  // Automatically open collapsibles that contain active items
  React.useEffect(() => {
    const newOpenState = {};
    
    data.navMain.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some(
          subItem => router.pathname === subItem.url
        ) || (router.pathname.startsWith(item.url + "/") && item.url !== "/dashboard");
        
        if (hasActiveChild) {
          newOpenState[item.title] = true;
        }
      }
    });
    
    setOpenCollapsibles(prev => ({
      ...prev,
      ...newOpenState
    }));
  }, [router.pathname]);

  // Handle collapsible toggle
  const handleCollapsibleToggle = (title) => {
    setOpenCollapsibles(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Handle logout
  const handleLogout = (e, url) => {
    if (url === "/dashboard/account/logout") {
      e.preventDefault();
      // Add your logout logic here
      // dispatch(logoutUser());
      router.push("/login");
    }
  };

  // Base styles - removed the interaction styles that were making everything look active
  const baseButtonStyles = "text-gray-300 hover:bg-[var(--buttonbg)] hover:text-white transition-colors";
  const activeButtonStyles = "bg-[var(--buttonbg)] text-white";

  return (
    <Sidebar
      {...props}
      className="bg-black text-white border-r border-gray-800"
    >
      <SidebarHeader className="border-b border-gray-800 bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="hover:bg-[var(--buttonbg)] hover:text-white transition-colors" 
              size="lg" 
              asChild
            >
              <Link href="/" className="text-white hover:text-white">
                <div className="bg-gray-800 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-white">SiraNet</span>
                  <span className="text-white/60">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const Icon = item.icon;
              const hasItems = item.items && item.items.length > 0;
              const isActive = isItemActive(item);
              const isOpen = openCollapsibles[item.title] || isParentActive(item);
              
              return (
                <SidebarMenuItem key={item.title}>
                  {hasItems ? (
                    // Render collapsible for items with children
                    <Collapsible
                      open={isOpen}
                      onOpenChange={() => handleCollapsibleToggle(item.title)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`${baseButtonStyles} ${isActive ? activeButtonStyles : ""}`}
                        >
                          {Icon && <Icon className="size-4" />}
                          <span>{item.title}</span>
                          <Plus className="ml-auto text-gray-400 group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto text-gray-400 group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="bg-black border-l border-gray-800">
                          {item.items.map((subItem) => {
                            const isSubActive = isUrlExactlyActive(subItem.url);
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={`text-gray-400 hover:bg-[var(--buttonbg)] hover:text-white transition-colors ${
                                    isSubActive ? activeButtonStyles : ""
                                  }`}
                                 
                                >
                                  <Link href={subItem.url}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Render regular menu button for items without children
                    <SidebarMenuButton 
                      asChild
                      className={`${baseButtonStyles} ${isActive ? activeButtonStyles : ""}`}
                      onClick={(e) => {
                        if (item.url === "/dashboard/account/logout") {
                          handleLogout(e, item.url);
                        }
                      }}
                    >
                      <Link href={item.url}>
                        {Icon && <Icon className="size-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="bg-black" />
    </Sidebar>
  );
}