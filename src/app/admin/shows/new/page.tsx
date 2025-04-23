import { type Metadata } from "next";
import { ShowForm } from "~/components/admin/shows/show-form";

export const metadata: Metadata = {
  title: "Create New Show | Admin Dashboard",
  description: "Add a new show to the system",
};

export default function NewShowPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Show</h1>
      <div className="rounded-md border p-6">
        <ShowForm />
      </div>
    </div>
  );
}
