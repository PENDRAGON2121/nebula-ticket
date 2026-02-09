"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Ticket,
  LayoutDashboard,
  LogOut,
  ExternalLink
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;
  const isStaff = role === "ADMIN" || role === "AGENTE";

  const isActive = (path: string) => {
      return pathname === path || pathname.startsWith(path + '/');
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/Nebula.ico" alt="Nebula Logo" className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nebula Tickets</span>
                  <span className="truncate text-xs">Help Desk</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isStaff ? "Plataforma" : "Mi Portal"}</SidebarGroupLabel>
          <SidebarMenu>
            {isStaff && (
              <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/"}>
                      <Link href="/">
                          <LayoutDashboard />
                          <span>Dashboard</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/tickets")}>
                    <Link href="/tickets">
                        <Ticket />
                        <span>{isStaff ? "Tickets" : "Mis Tickets"}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {isStaff && (
              <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/asignaciones")}>
                      <Link href="/asignaciones">
                          <BookOpen />
                          <span>Asignaciones</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        {isStaff && (
          <SidebarGroup>
             <SidebarGroupLabel>Ecosistema</SidebarGroupLabel>
             <SidebarMenu>
               <SidebarMenuItem>
                 <SidebarMenuButton asChild>
                   <a href={process.env.NEXT_PUBLIC_NEBULA_ASSETS_URL || "#"} target="_blank" rel="noopener noreferrer">
                     <ExternalLink />
                     <span>Nebula Assets</span>
                   </a>
                 </SidebarMenuButton>
               </SidebarMenuItem>
             </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="rounded-lg">
                            {session?.user?.name?.slice(0,2)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name}</span>
                        <span className="truncate text-xs">{session?.user?.email}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut()}>
                    <LogOut />
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
