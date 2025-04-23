"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { formatDate, formatTime, formatCurrency } from "~/lib/utils";
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

interface Show {
  id: string;
  startTime: Date;
  price: number;
  movie: {
    id: string;
    title: string;
  };
  theater: {
    id: string;
    name: string;
  };
  screen: {
    id: string;
    name: string;
  };
}

interface ShowsListProps {
  shows: Show[];
}

export function ShowsList({ shows: initialShows }: ShowsListProps) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [showToDelete, setShowToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const deleteShowMutation = api.show.delete.useMutation({
    onSuccess: () => {
      setShows((prevShows) => prevShows.filter(show => show.id !== showToDelete));
      toast({
        title: "Show deleted successfully",
        variant: "success",
      });
      setShowToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting show",
        description: error.message,
        variant: "destructive",
      });
      setShowToDelete(null);
    }
  });

  const handleDeleteShow = (id: string) => {
    setShowToDelete(id);
  };

  const confirmDelete = () => {
    if (showToDelete) {
      deleteShowMutation.mutate({ id: showToDelete });
    }
  };

  if (shows.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No shows found. Add your first show to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movie</TableHead>
                <TableHead>Theater</TableHead>
                <TableHead>Screen</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shows.map((show) => (
                <TableRow key={show.id}>
                  <TableCell>{show.movie.title}</TableCell>
                  <TableCell>{show.theater.name}</TableCell>
                  <TableCell>{show.screen.name}</TableCell>
                  <TableCell>{formatDate(show.startTime)}</TableCell>
                  <TableCell>{formatTime(show.startTime)}</TableCell>
                  <TableCell>{formatCurrency(show.price)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/shows/edit/${show.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive hover:bg-destructive/10" 
                        onClick={() => handleDeleteShow(show.id)}
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
      </div>

      <AlertDialog open={!!showToDelete} onOpenChange={() => setShowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this show. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
