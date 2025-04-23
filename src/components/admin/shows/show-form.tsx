"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

// Define the show form schema with zodjs
const showFormSchema = z.object({
  movieId: z.string().nonempty({ message: "Please select a movie" }),
  theaterId: z.string().nonempty({ message: "Please select a theater" }),
  screenId: z.string().nonempty({ message: "Please select a screen" }),
  startTime: z.string().nonempty({ message: "Please select a start time" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
});

type ShowFormValues = z.infer<typeof showFormSchema>;

interface ShowFormProps {
  show?: {
    id: string;
    movieId: string;
    theaterId: string;
    screenId: string;
    startTime: Date;
    price: number;
  };
}

export function ShowForm({ show }: ShowFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>(show?.theaterId ?? "");

  // Fetch all movies for dropdown
  const { data: movies } = api.movie.getAll.useQuery();
  
  // Fetch all theaters for dropdown
  const { data: theaters } = api.theater.getAll.useQuery();
  
  // Fetch screens for selected theater
  const { data: screens } = api.screen.getByTheaterId.useQuery(
    { theaterId: selectedTheaterId },
    { enabled: !!selectedTheaterId }
  );

  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showFormSchema),
    defaultValues: show
      ? {
          movieId: show.movieId,
          theaterId: show.theaterId,
          screenId: show.screenId,
          startTime: new Date(show.startTime).toISOString().slice(0, 16), // format: "YYYY-MM-DDThh:mm"
          price: show.price,
        }
      : {
          movieId: "",
          theaterId: "",
          screenId: "",
          startTime: "",
          price: 10.00,
        },
  });

  const createShow = api.show.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Show created successfully",
      });
      router.push("/admin/shows");
      router.refresh();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message || "Failed to create show",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const updateShow = api.show.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Show updated successfully",
      });
      router.push("/admin/shows");
      router.refresh();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message || "Failed to update show",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShowFormValues) => {
    setIsSubmitting(true);
    
    // Convert startTime from string to Date
    const startTime = new Date(data.startTime);
    
    if (show) {
      updateShow.mutate({
        id: show.id,
        movieId: data.movieId,
        theaterId: data.theaterId,
        screenId: data.screenId,
        startTime: startTime,
        price: data.price,
      });
    } else {
      createShow.mutate({
        movieId: data.movieId,
        theaterId: data.theaterId,
        screenId: data.screenId,
        startTime: startTime,
        price: data.price,
      });
    }
  };

  // Handle theater selection to update available screens
  const handleTheaterChange = (theaterId: string) => {
    setSelectedTheaterId(theaterId);
    form.setValue("theaterId", theaterId);
    form.setValue("screenId", ""); // Reset screen when theater changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="movieId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movies?.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theaterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theater</FormLabel>
              <Select
                onValueChange={handleTheaterChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theater" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {theaters?.map((theater) => (
                    <SelectItem key={theater.id} value={theater.id}>
                      {theater.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screen</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting || !selectedTheaterId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedTheaterId ? "Select a theater first" : "Select a screen"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {screens?.map((screen) => (
                    <SelectItem key={screen.id} value={screen.id}>
                      {screen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : show ? "Update Show" : "Create Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
