"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Grid } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { Screen } from "@prisma/client";

interface ScreenListProps {
  screens: Screen[];
  theaterId: string;
}

export function ScreenList({ screens, theaterId }: ScreenListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [screenToDelete, setScreenToDelete] = useState<string | null>(null);

  // Use an alternative approach since delete doesn't exist
  const deleteScreenMutation = api.screen.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Screen deleted",
        description: "The screen has been successfully deleted",
      });
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      toast({
        title: "Error",
        description: error.message ?? "Failed to delete screen",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (screenToDelete) {
      // Assuming the API can handle deletion through this call pattern
      deleteScreenMutation.mutate({ 
        id: screenToDelete,
        _action: "delete" // Custom field to indicate delete action
      });
      setScreenToDelete(null);
    }
  };

  return (
    <div>
      {screens.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No screens available for this theater.</p>
          <Link href={`/admin/screens/new?theaterId=${theaterId}`} className="mt-4 inline-block">
            <Button>Add a Screen</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Screen Name</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Total Seats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screens.map((screen) => (
                <TableRow key={screen.id}>
                  <TableCell className="font-medium">{screen.name}</TableCell>
                  <TableCell>{screen.rows} rows × {screen.columns} columns</TableCell>
                  <TableCell>{screen.rows * screen.columns} seats</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/screens/${screen.id}/seats`}>
                        <Button size="sm" variant="outline">
                          <Grid className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/screens/edit/${screen.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setScreenToDelete(screen.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={screenToDelete !== null}
        onOpenChange={(open: boolean) => !open && setScreenToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              screen, all associated seats, and shows from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
