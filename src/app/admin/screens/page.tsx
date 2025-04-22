import type { Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { ScreenList } from "~/components/admin/screens/screen-list";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { TheaterSelector } from "~/components/admin/screens/theater-selector";

export const metadata: Metadata = {
  title: "Manage Screens | Admin Dashboard",
  description: "Add, edit and delete screens in theaters",
};

// Update Theater interface to match expected format in TheaterSelector component
interface Theater {
  id: string;
  name: string;
  location: string;
}

interface Screen {
  id: string;
  name: string;
  rows: number;
  columns: number;
  theaterId: string;
}

interface AdminScreensPageProps {
  searchParams: {
    theaterId?: string;
  };
}

export default async function AdminScreensPage({ searchParams }: AdminScreensPageProps) {
  const { theaterId } = searchParams;
  
  try {
    // Replace .query calls with direct API calls
    const theaters = await api.theater.getAll() as Theater[];
    
    let screens: Screen[] = [];
    let selectedTheater: Theater | null = null;

    if (theaterId) {
      screens = await api.screen.getByTheaterId({ theaterId }) as Screen[];
      selectedTheater = theaters.find((theater: Theater) => theater.id === theaterId) ?? null;
    } else if (theaters.length > 0) {
      // Make sure theaters[0] is not undefined before accessing it
      const firstTheater = theaters[0];
      if (firstTheater) {
        screens = await api.screen.getByTheaterId({ theaterId: firstTheater.id }) as Screen[];
        selectedTheater = firstTheater;
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/admin/theaters">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Theaters
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Screens</h1>
            {selectedTheater && (
              <p className="text-muted-foreground">For theater: {selectedTheater.name}</p>
            )}
          </div>
          
          <TheaterSelector theaters={theaters} selectedTheaterId={selectedTheater?.id} />
          
          {selectedTheater && (
            <Link href={`/admin/screens/new?theaterId=${selectedTheater.id}`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Screen
              </Button>
            </Link>
          )}
        </div>

        {selectedTheater ? (
          <ScreenList screens={screens} theaterId={selectedTheater.id} />
        ) : (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No theaters available. Please add a theater first.</p>
            <Link href="/admin/theaters/new" className="mt-4 inline-block">
              <Button>Add a Theater</Button>
            </Link>
          </div>
        )}
      </div>
    );
  } catch (errorObj) {
    console.error("Error loading screens:", errorObj);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Screens</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Error loading screens. Please try again later.</p>
        </div>
      </div>
    );
  }
}
