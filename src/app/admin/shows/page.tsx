import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { ShowsList } from "~/components/admin/shows/shows-list";

export const metadata: Metadata = {
  title: "Manage Shows | Admin Dashboard",
  description: "Add, edit and delete show schedules in the system",
};

export default async function AdminShowsPage() {
  try {
    const shows = await api.show.getAll();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shows</h1>
          <Link href="/admin/shows/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Show
            </Button>
          </Link>
        </div>

        <ShowsList shows={shows || []} />
      </div>
    );
  } catch (error) {
    console.error("Error loading shows:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shows</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Failed to load shows. Please try again later.</p>
        </div>
      </div>
    );
  }
}
