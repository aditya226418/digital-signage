import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Monitor,
  Image,
  Layers,
  Send,
  Settings,
  User,
  Grid3x3,
  CreditCard,
} from "lucide-react";
import DashboardContent from "./DashboardContent";
import ScreensTable from "./ScreensTable";
import { MediaTable } from "./MediaTables";
import { CompositionsTable } from "./CompositionTables";
import PublishTable from "./PublishTable";
import AppsGallery from "./AppsGallery";
import MyPlan from "./MyPlan";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

interface Screen {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: string;
}

interface Playlist {
  id: string;
  name: string;
  itemCount: number;
}

interface EngagedDashboardProps {
  screens: Screen[];
  totalScreens: number;
  onlineCount: number;
  offlineCount: number;
  mediaCount: number;
  playlists: Playlist[];
  activeCampaigns: number;
  uptime: number;
  onAddScreen?: () => void;
  onUploadMedia?: () => void;
  onCreatePlaylist?: () => void;
}

const moduleIds = [
  "dashboard",
  "screens",
  "media",
  "compositions",
  "apps",
  "publish",
  "myplan",
  "settings",
  "account",
];

const moduleSet = new Set(moduleIds);

const getActiveModule = (path: string) => {
  const trimmedPath = path.replace(/^[\/]+|[\/]+$/g, "");
  if (!trimmedPath) {
    return "dashboard";
  }

  const [segment] = trimmedPath.split("/");
  return moduleSet.has(segment) ? segment : "dashboard";
};

const getModulePath = (moduleId: string) =>
  moduleId === "dashboard" ? "/dashboard" : `/${moduleId}`;

export default function EngagedDashboard({
  screens,
  totalScreens,
  onlineCount,
  offlineCount,
  mediaCount,
  playlists,
  activeCampaigns,
  uptime,
  onAddScreen,
  onUploadMedia,
  onCreatePlaylist,
}: EngagedDashboardProps) {
  const [location, setLocation] = useLocation();
  const activeModule = getActiveModule(location);

  const handleNavigate = (moduleId: string) => {
    const nextPath = getModulePath(moduleId);
    if (location !== nextPath) {
      setLocation(nextPath);
    }
  };

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "screens", label: "Screens", icon: Monitor },
    { id: "media", label: "Media", icon: Image },
    { id: "compositions", label: "Compositions", icon: Layers },
    { id: "apps", label: "Apps", icon: Grid3x3 },
    { id: "publish", label: "Publish", icon: Send },
  ];

  const footerNavItems = [
    { id: "myplan", label: "My Plan", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "account", label: "Account Settings", icon: User },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r border-border/40">
        <SidebarHeader className="border-b border-border/40 bg-gradient-to-br from-primary/5 to-transparent shrink-0">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm font-bold text-base">
              P
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">Pickel</span>
              <span className="text-xs text-muted-foreground">Digital Signage</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar to-sidebar-accent/20">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeModule === item.id}
                      onClick={() => handleNavigate(item.id)}
                      tooltip={item.label}
                      className="group/item"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {footerNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeModule === item.id}
                      onClick={() => handleNavigate(item.id)}
                      tooltip={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 bg-gradient-to-t from-primary/5 to-transparent shrink-0">
          <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-muted-foreground">
              © 2025 Pickel
            </p>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur-sm">
            <SidebarTrigger className="hover:bg-accent" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                {activeModule === "dashboard" ? (
                  <>
                    <h1 className="text-lg font-semibold" data-testid="text-dashboard-title">
                      Welcome Brian
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Manage your digital signage screens and content
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg font-semibold capitalize">
                      {activeModule === "myplan" ? "My Plan" : activeModule}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {activeModule === "screens" && "Manage and monitor your screens"}
                      {activeModule === "media" && "Manage all your media files"}
                      {activeModule === "compositions" && "Combine layouts and playlists into screen compositions"}
                      {activeModule === "apps" && "Browse and add app integrations"}
                      {activeModule === "publish" && "Schedule and publish content"}
                      {activeModule === "myplan" && "View and manage your subscription"}
                      {activeModule === "settings" && "Configure application settings"}
                      {activeModule === "account" && "Manage your account"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              <div 
                key={activeModule} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {activeModule === "dashboard" && (
                  <DashboardContent
                    screens={screens}
                    totalScreens={totalScreens}
                    onlineCount={onlineCount}
                    offlineCount={offlineCount}
                    mediaCount={mediaCount}
                    playlists={playlists}
                    activeCampaigns={activeCampaigns}
                    uptime={uptime}
                    onAddScreen={onAddScreen}
                    onUploadMedia={onUploadMedia}
                    onCreatePlaylist={onCreatePlaylist}
                  />
                )}

                {activeModule === "screens" && <ScreensTable />}

                {activeModule === "media" && <MediaTable />}

                {activeModule === "compositions" && <CompositionsTable />}

                {activeModule === "apps" && <AppsGallery />}

                {activeModule === "publish" && <PublishTable />}

                {activeModule === "myplan" && <MyPlan />}

                {activeModule === "settings" && (
                  <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Settings</h3>
                    <p className="mt-2 text-muted-foreground">
                      Configure your application settings
                    </p>
                  </div>
                )}

                {activeModule === "account" && (
                  <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Account Settings</h3>
                    <p className="mt-2 text-muted-foreground">
                      Manage your account and preferences
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
