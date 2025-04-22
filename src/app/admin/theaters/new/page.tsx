import { type Metadata } from "next";
import Link from "next/link";
import { TheaterForm } from "~/components/admin/theaters/theater-form";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Add New Theater | Admin Dashboard",
  description: "Add a new theater to the system",
};

export default function NewTheaterPage() {
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

      <h1 className="text-3xl font-bold">Add New Theater</h1>
      <TheaterForm />
    </div>
  );
}
