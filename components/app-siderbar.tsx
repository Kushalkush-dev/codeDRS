"use client"
import React from 'react'

import { BookOpen, Settings, Moon, Sun, LogOutIcon } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Logout from '@/modules/auth/components/Logout';

const AppSidebar = () => {

    const { theme, resolvedTheme, setTheme } = useTheme()
    const pathname = usePathname();
    const { data: session } = useSession();

    const isDark = resolvedTheme === "dark"

    const { isMobile, setOpenMobile } = useSidebar()

    const navigationItems = [

        {
            title: "Dashboard",
            icon: BookOpen,
            url: "/dashboard"

        },
        {
            title: "Repository",
            icon: FaGithub,
            url: "/dashboard/repository"

        },
        {
            title: "Reviews",
            icon: BookOpen,
            url: "/dashboard/reviews"

        },
        {
            title: "Subscriptions",
            icon: BookOpen,
            url: "/dashboard/subscription"

        },
        {
            title: "Settings",
            icon: Settings,
            url: "/dashboard/settings"

        },
    ]

    const isActive = (url: string) => {
        return pathname == url || pathname.startsWith(url + "/dashboard")
    }

    const handleNavigate = () => {
        if (isMobile) setOpenMobile(false)
    }

    if (!session) return null

    const user = session.user;
    const userName = user.name || "Guest";
    const userEmail = user.email || " ";
    const userImage = user.image || " ";
    const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex flex-col gap-4 px-2 py-6">
                    <div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black text-white shrink-0 overflow-hidden">
                            <FaGithub className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-sidebar-foreground tracking-wide">Connected Account</p>
                            <p className="text-sm font-medium text-sidebar-foreground/90">@{userName}</p>
                            <p className="text-xs text-sidebar-foreground/70 truncate">{userEmail}</p>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-6 flex-col gap-1">
                <div className="mb-2">
                    <p className="text-xs font-semibold text-sidebar-foreground/60 px-3 mb-3 uppercase tracking-widest">Menu</p>
                </div>

                <SidebarMenu className="gap-2">
                    {
                        navigationItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={`h-11 px-4 rounded-lg transition-all duration-200 ${isActive(item.url)
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold ring-1 ring-primary"
                                        : "hover:bg-sidebar-accent/60 text-sidebar-foreground"}`}
                                >
                                    <Link href={item.url} className="flex items-center gap-3" onClick={handleNavigate}>
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    }

                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className='border-t px-3 py-4'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="h-12 px-4 cursor-pointer hover:scale-105 transition-all rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 flex items-center gap-3"
                               >
                                    <Avatar className="h-10 w-10 rounded-lg shrink-0">
                                        <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                                        <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-relaxed min-w-0">
                                        <span className="truncate font-semibold text-base">{userName}</span>
                                        <span className="truncate text-xs text-sidebar-foreground/70">{userEmail}</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-72 overflow-hidden rounded-lg p-0"
                                align="end"
                                side="right"
                                sideOffset={8}
                            >
                                <div className="flex items-center gap-3 bg-sidebar-accent/30 p-3">
                                    <Avatar className="w-12 rounded-full shrink-0">
                                        <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                                        <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-semibold">{userName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="m-0" />

                                <div className="p-1">

                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault()
                                            setTheme(isDark ? "light" : "dark")
                                        }}
                                        className="flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-sm font-medium"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="h-4 w-4 shrink-0" />
                                                <span>Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-4 w-4 shrink-0" />
                                                <span>Dark Mode</span>
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator className="m-0" />

                                <div className="p-1">
                                    <DropdownMenuItem
                                        asChild
                                        variant="destructive"
                                        className="h-10 cursor-pointer gap-3 rounded-md px-3 text-sm font-medium"
                                    >
                                        <Logout className="flex w-full items-center gap-3 hover:bg-red-600">
                                            <LogOutIcon className="h-4 w-4 shrink-0" />
                                            <span >Sign Out</span>
                                        </Logout>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}


export default AppSidebar
