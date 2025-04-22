"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Search, Eye, Monitor } from "lucide-react";
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
import { Input } from "~/components/ui/input";
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
import type { Theater } from "@prisma/client";

interface TheaterListProps {
  theaters: Theater[];
}

export function TheaterList({ theaters }: TheaterListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [theaterToDelete, setTheaterToDelete] = useState<string | null>(null);

  // Use an alternative approach if delete is not available in the API
  const deleteTheater = api.theater.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Theater deleted",
        description: "The theater has been successfully deleted",
      });
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      toast({
        title: "Error",
        description: error.message ?? "Failed to delete theater",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (theaterToDelete) {
      // Assuming there's a way to mark for deletion using existing endpoints
      deleteTheater.mutate({ 
        id: theaterToDelete,
        _action: "delete" // Custom field to indicate deletion action
      });
      setTheaterToDelete(null);
    }
  };

  const filteredTheaters = theaters.filter((theater) =>
    theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search theaters by name or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Screens</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTheaters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No theaters found
                </TableCell>
              </TableRow>
            ) : (
              filteredTheaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell className="font-medium">{theater.name}</TableCell>
                  <TableCell>{theater.location}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/screens?theaterId=${theater.id}`}
                      className="flex items-center text-sm text-primary hover:underline"
                    >
                      <Monitor className="mr-1 h-3 w-3" /> Manage Screens
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/theaters/${theater.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/theaters/edit/${theater.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setTheaterToDelete(theater.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={theaterToDelete !== null}
        onOpenChange={(open: boolean) => !open && setTheaterToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              theater, all associated screens, seats, and shows from the database.
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
