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
      url: "/applications",
      icon: File,
    },
    {
      title: "Saved Jobs",
      url: "/saved-jobs",
      icon: Save,
    },
    {
      title: "Interviews",
      url: "/interviews",
      icon: Mic,
    },
    {
      title: "Offers",
      url: "/offers",
      icon: BadgeDollarSign,
    },
    {
      title: "Tracking",
      url: "/tracking",
      icon: ChartBar,
      items: [
        {
          title: "Job Pipeline",
          url: "/tracking/pipeline",
        },
        {
          title: "Application Status",
          url: "/tracking/status",
        },
        {
          title: "Notes",
          url: "/tracking/notes",
        },
        {
          title: "Activity Log",
          url: "/tracking/activity",
        }
      ],
    },
    {
      title: "Tools",
      url: "/tools",
      icon: ToolCase,
      items: [
        {
          title: "Resume Manager",
          url: "/tools/resume",
        },
        {
          title: "Cover Letters",
          url: "/tools/cover-letters",
          isActive: true,
        },
        {
          title: "Documents",
          url: "/tools/documents",
        },
        
      ],
    },
    {
      title: "Insights",
      url: "/insights",
      icon: Eye,
      items: [
        {
          title: "Analytics",
          url: "/insights/analytics",
        },
        {
          title: "Progress Report",
          url: "/insights/progress",
        },
        {
          title: "Weekly Summary",
          url: "/insights/weekly",
        },
      ],
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
      items: [
        {
          title: "Profile",
          url: "/account/profile",
        },
        {
          title: "Settings",
          url: "/account/settings",
        },
        {
          title: "Logout",
          url: "/account/logout",
        },
      ],
    },
    
  ],
};

export function AppSidebar({ ...props }) {
  // Track active item - in a real app, this would come from your router
  const [activeItem, setActiveItem] = React.useState(() => {
    // You can initialize this based on current path
    // For demo, let's set Dashboard as active
    return "/dashboard";
  });

  // Function to check if an item or its children are active
  const isItemActive = (item, itemUrl) => {
    if (itemUrl === activeItem) return true;
    if (item.items) {
      return item.items.some(subItem => subItem.url === activeItem);
    }
    return false;
  };

  // Function to check if a specific URL is active
  const isUrlActive = (url) => {
    return activeItem === url;
  };

  const handleItemClick = (url) => {
    setActiveItem(url);
    // In a real app, you'd also navigate to the URL
    // using your router (next/router, react-router, etc.)
  };

  return (
    <Sidebar
      {...props}
      className={`bg-black text-white border-r border-gray-800`}
    >
      <SidebarHeader className="border-b border-gray-800 bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="text-white hover:text-white">
                <div className="bg-gray-800 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-white">Documentation</span>
                  <span className="text-gray-400">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => {
              const Icon = item.icon;
              const hasItems = item.items && item.items.length > 0;
              const isActive = isItemActive(item, item.url);
              
              return (
                <SidebarMenuItem key={item.title}>
                  {hasItems ? (
                    // Render collapsible for items with children
                    <Collapsible
                      defaultOpen={isActive || index === 1}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`text-gray-300 hover:text-white hover:bg-gray-800 data-[state=open]:text-white ${
                            isActive ? "bg-gray-800 text-white" : ""
                          }`}
                        >
                          <span>{Icon && <Icon className="size-4" />}</span>
                          {item.title}{" "}
                          <Plus className="ml-auto text-gray-400 group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto text-gray-400 group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="bg-black border-l border-gray-800">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isUrlActive(subItem.url)}
                                className={`text-gray-400 hover:text-white hover:bg-gray-800 ${
                                  isUrlActive(subItem.url) ? "bg-gray-800 text-white" : ""
                                }`}
                                onClick={() => handleItemClick(subItem.url)}
                              >
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Render regular menu button for items without children
                    <SidebarMenuButton 
                      asChild
                      className={`text-gray-300 hover:text-white hover:bg-gray-800 ${
                        isUrlActive(item.url) ? "bg-gray-800 text-white" : ""
                      }`}
                      onClick={() => handleItemClick(item.url)}
                    >
                      <a href={item.url}>
                        <span>{Icon && <Icon className="size-4" />}</span>
                        {item.title}
                      </a>
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