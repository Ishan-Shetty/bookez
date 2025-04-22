import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { DashboardTabs } from "~/components/dashboard/dashboard-tabs";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  
  if (!session) {
    // Encode the full URL to ensure proper redirect after sign in
    const callbackUrl = encodeURIComponent("/dashboard");
    redirect(`/auth/signin?callbackUrl=${callbackUrl}`);
  }
  
  // Redirect admins to admin dashboard
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }
  
  return (
    <HydrateClient>
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>
        <DashboardTabs userId={session.user.id} />
      </div>
    </HydrateClient>
  );
}
