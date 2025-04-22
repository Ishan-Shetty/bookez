import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";
import { TheaterForm } from "~/components/admin/theaters/theater-form";
import { Button } from "~/components/ui/button";

interface EditTheaterPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditTheaterPageProps): Promise<Metadata> {
  try {
    const theater = await api.theater.getById({ id: params.id });
    return {
      title: theater ? `Edit ${theater.name} | Admin Dashboard` : "Edit Theater | Admin Dashboard",
      description: "Edit theater details",
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Edit Theater | Admin Dashboard",
      description: "Edit theater details",
    };
  }
}

export default async function EditTheaterPage({ params }: EditTheaterPageProps) {
  try {
    const theater = await api.theater.getById({ id: params.id });

    if (!theater) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/theaters">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Theaters
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Edit Theater: {theater.name}</h1>
        <TheaterForm theater={theater} />
      </div>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
