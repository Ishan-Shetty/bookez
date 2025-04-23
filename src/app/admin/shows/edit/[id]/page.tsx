import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { ShowForm } from "~/components/admin/shows/show-form";

export const metadata: Metadata = {
  title: "Edit Show | Admin Dashboard",
  description: "Modify an existing show",
};

export default async function EditShowPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const show = await api.show.getById({ id: params.id });

    if (!show) {
      return notFound();
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Show</h1>
        <div className="rounded-md border p-6">
          <ShowForm show={show} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading show:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Show</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Error loading show information.</p>
        </div>
      </div>
    );
  }
}
