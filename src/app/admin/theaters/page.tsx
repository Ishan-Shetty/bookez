import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { TheaterList } from "~/components/admin/theaters/theater-list";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Theaters | Admin Dashboard",
  description: "Add, edit and delete theaters in the system",
};

interface Theater {
  id: string;
  name: string;
  location: string;
}

export default async function AdminTheatersPage() {
  try {
    // Fix the API call by removing .query
    const theaters = await api.theater.getAll() as Theater[];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Theaters</h1>
          <Link href="/admin/theaters/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Theater
            </Button>
          </Link>
        </div>

        <TheaterList theaters={theaters ?? []} />
      </div>
    );
  } catch (error) {
    console.error("Error loading theaters:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Theaters</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Error loading theaters. Please try again later.</p>
        </div>
      </div>
    );
  }
}
