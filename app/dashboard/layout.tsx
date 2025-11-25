import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { AppSidebar } from "@/app/dashboard/components/app-sidebar"
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from './components/site-header';

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = (await auth())?.user;

    if (!user) {
        redirect('/login');
    }

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"


    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" user={user} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
