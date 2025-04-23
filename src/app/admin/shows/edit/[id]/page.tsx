import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";
import { ShowForm } from "~/components/admin/shows/show-form";
import { Button } from "~/components/ui/button";
import { formatDate, formatTime } from "~/lib/utils";

interface EditShowPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditShowPageProps): Promise<Metadata> {
  try {
    const show = await api.show.getById({ id: params.id });
    return {
      title: show ? `Edit Show | Admin Dashboard` : "Edit Show | Admin Dashboard",
      description: "Edit show details",
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Edit Show | Admin Dashboard",
      description: "Edit show details",
    };
  }
}

export default async function EditShowPage({ params }: EditShowPageProps) {
  try {
    const show = await api.show.getById({ id: params.id });

    if (!show) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/shows">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Shows
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Edit Show</h1>
        <p className="text-muted-foreground">
          {show.movie.title} at {show.theater.name} ({formatDate(show.startTime)} {formatTime(show.startTime)})
        </p>
        
        <ShowForm show={show} />
      </div>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
