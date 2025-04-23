import { type Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ShowForm } from "~/components/admin/shows/show-form";

export const metadata: Metadata = {
  title: "Add New Show | Admin Dashboard",
  description: "Add a new show schedule to the system",
};

export default function NewShowPage() {
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

      <h1 className="text-3xl font-bold">Add New Show</h1>
      <p className="text-muted-foreground">Schedule a new movie showing</p>
      
      <ShowForm />
    </div>
  );
}
