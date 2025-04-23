"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
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
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

// Define show form schema
const showFormSchema = z.object({
  movieId: z.string().min(1, "Movie is required"),
  theaterId: z.string().min(1, "Theater is required"),
  screenId: z.string().min(1, "Screen is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(1000, "Price must be less than $1000"),
});

type ShowFormValues = z.infer<typeof showFormSchema>;

interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  startTime: Date;
  price: number;
}

interface Movie {
  id: string;
  title: string;
}

interface Theater {
  id: string;
  name: string;
}

interface Screen {
  id: string;
  name: string;
  theaterId: string;
}

export function ShowForm({ show }: { show?: Show }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>(show?.theaterId || "");

  // Get movies for dropdown
  const { data: movies, isLoading: isLoadingMovies } = api.movie.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get theaters for dropdown
  const { data: theaters, isLoading: isLoadingTheaters } = api.theater.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get screens for dropdown (filtered by selected theater)
  const { data: screens, isLoading: isLoadingScreens } = api.screen.getByTheaterId.useQuery(
    { theaterId: selectedTheaterId },
    {
      enabled: !!selectedTheaterId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Create or update show mutation
  const createShow = api.show.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Show has been created.",
      });
      router.push("/admin/shows");
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create show. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const updateShow = api.show.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Show has been updated.",
      });
      router.push("/admin/shows");
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update show. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Parse initial values if editing
  let defaultValues: Partial<ShowFormValues> = {};
  
  if (show) {
    const showDate = new Date(show.startTime);
    defaultValues = {
      movieId: show.movieId,
      theaterId: show.theaterId,
      screenId: show.screenId,
      date: showDate,
      time: format(showDate, "HH:mm"),
      price: show.price,
    };
    // Initialize selected theater ID for filtering screens
    if (!selectedTheaterId && show.theaterId) {
      setSelectedTheaterId(show.theaterId);
    }
  }

  // Create form
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showFormSchema),
    defaultValues,
  });

  // Handle theater change to filter screens
  const handleTheaterChange = (theaterId: string) => {
    setSelectedTheaterId(theaterId);
    form.setValue("theaterId", theaterId);
    form.setValue("screenId", ""); // Reset screen selection
  };

  // Handle form submission
  const onSubmit = (values: ShowFormValues) => {
    setIsSubmitting(true);
    
    // Parse date and time to create a full datetime
    const [hours, minutes] = values.time.split(":").map(Number);
    const startTime = new Date(values.date);
    startTime.setHours(hours, minutes, 0, 0);
    
    // Check if we're creating or updating
    if (show?.id) {
      updateShow.mutate({
        id: show.id,
        movieId: values.movieId,
        theaterId: values.theaterId,
        screenId: values.screenId,
        startTime,
        price: values.price,
      });
    } else {
      createShow.mutate({
        movieId: values.movieId,
        theaterId: values.theaterId,
        screenId: values.screenId,
        startTime,
        price: values.price,
      });
    }
  };

  // Loading state for data dependencies
  const isLoading = isLoadingMovies || isLoadingTheaters || isLoadingScreens;

  return (
    <div className="max-w-2xl space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Movie selection */}
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
                      {movies?.map((movie: Movie) => (
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

            {/* Theater selection */}
            <FormField
              control={form.control}
              name="theaterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theater</FormLabel>
                  <Select
                    onValueChange={(value) => handleTheaterChange(value)}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theater" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {theaters?.map((theater: Theater) => (
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

            {/* Screen selection (filtered by theater) */}
            <FormField
              control={form.control}
              name="screenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screen</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedTheaterId || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedTheaterId 
                            ? "Select a theater first" 
                            : "Select a screen"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {screens?.map((screen: Screen) => (
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

            {/* Date selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time selection */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {show ? "Update Show" : "Create Show"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
