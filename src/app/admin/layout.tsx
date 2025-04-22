import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { AdminSidebar } from "~/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerAuthSession();
  
  // Check if the user is authenticated and has admin role
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6">
        <main>{children}</main>
      </div>
    </div>
  );
}
