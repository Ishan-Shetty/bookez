import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";
import { ScreenForm } from "~/components/admin/screens/screen-form";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Add New Screen | Admin Dashboard",
  description: "Add a new screen to a theater",
};

interface Theater {
  id: string;
  name: string;
}

interface NewScreenPageProps {
  searchParams: {
    theaterId?: string;
  };
}

export default async function NewScreenPage({ searchParams }: NewScreenPageProps) {
  const { theaterId } = searchParams;
  
  if (!theaterId) {
    redirect("/admin/screens");
  }
  
  try {
    const theater = await api.theater.getById({ id: theaterId }) as Theater | null;
    
    if (!theater) {
      redirect("/admin/theaters");
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/admin/screens?theaterId=${theaterId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Screens
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Add New Screen</h1>
        <p className="text-muted-foreground">For theater: {theater.name}</p>
        
        <ScreenForm theaterId={theaterId} />
      </div>
    );
  } catch (error) {
    console.log(error);
    // Redirect to theaters page if there's any error
    redirect("/admin/theaters");
  }
}
