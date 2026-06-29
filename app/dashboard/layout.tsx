import AppSidebar from '@/components/app-siderbar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { requireAuth } from '@/modules/auth/utils/auth-utils'
import React from 'react'


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth()
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <span className="text-xl font-black tracking-normal">
                            <span className="dark:text-white text-gray-600 ">code</span>
                            <span className="bg-gradient-to-r from-[#D84A4E] to-[#7042C7] bg-clip-text text-transparent ">
                                DRS
                            </span>
                        </span>
                    </header>
                    <main className="flex-1 overflow-auto p-4 md:p-6">

                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default DashboardLayout