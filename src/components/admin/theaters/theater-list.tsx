"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

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
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Theater {
  id: string;
  name: string;
  location: string;
}

interface TheaterListProps {
  theaters: Theater[];
}

export function TheaterList({ theaters }: TheaterListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [theaterToDelete, setTheaterToDelete] = useState<Theater | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter theaters based on search query
  const filteredTheaters = theaters.filter((theater) => 
    theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete theater mutation
  const deleteTheater = api.theater.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Theater deleted successfully",
        description: "The theater has been removed from the system."
      });
      router.refresh();
      setTheaterToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message ?? "Failed to delete theater",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTheater = () => {
    if (theaterToDelete) {
      deleteTheater.mutate({ id: theaterToDelete.id });
    }
  };

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search theaters by name or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTheaters.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No theaters found matching "${searchQuery}"`
              : "No theaters available"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTheaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell className="font-medium">{theater.name}</TableCell>
                  <TableCell>{theater.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/theaters/edit/${theater.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheaterToDelete(theater)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
        open={theaterToDelete !== null} 
        onOpenChange={(open) => !open && setTheaterToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the theater "{theaterToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTheater}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
