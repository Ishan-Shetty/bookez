import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";
import { ScreenForm } from "~/components/admin/screens/screen-form";
import { Button } from "~/components/ui/button";

interface EditScreenPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditScreenPageProps): Promise<Metadata> {
  try {
    const screen = await api.screen.getById({ id: params.id });
    return {
      title: screen ? `Edit ${screen.name} | Admin Dashboard` : "Edit Screen | Admin Dashboard",
      description: "Edit screen details",
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Edit Screen | Admin Dashboard",
      description: "Edit screen details",
    };
  }
}

export default async function EditScreenPage({ params }: EditScreenPageProps) {
  try {
    const screen = await api.screen.getById({ id: params.id });

    if (!screen) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/admin/screens?theaterId=${screen.theaterId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Screens
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Edit Screen: {screen.name}</h1>
        <p className="text-muted-foreground">For theater: {screen.theater?.name}</p>
        
        <ScreenForm 
          screen={screen} 
          theaterId={screen.theaterId} 
        />
      </div>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
