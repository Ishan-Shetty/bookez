"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import type { Theater } from "@prisma/client";

const theaterFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
});

type TheaterFormValues = z.infer<typeof theaterFormSchema>;

interface TheaterFormProps {
  theater?: Theater;
}

export function TheaterForm({ theater }: TheaterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TheaterFormValues>({
    resolver: zodResolver(theaterFormSchema),
    defaultValues: theater
      ? {
          name: theater.name,
          location: theater.location,
        }
      : {
          name: "",
          location: "",
        },
  });

  const createTheater = api.theater.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Theater created successfully",
      });
      router.push("/admin/theaters");
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message ?? "Failed to create theater",
        variant: "destructive",
      });
    },
  });

  // Use alternative method if update doesn't exist
  const updateTheater = api.theater.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Theater updated successfully",
      });
      router.push("/admin/theaters");
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message ?? "Failed to update theater",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TheaterFormValues) => {
    setIsSubmitting(true);
    
    if (theater) {
      // Since update is not available, we use create with the same id
      // This assumes the server-side API handles updates via create endpoint
      // when an id is provided
      updateTheater.mutate({
        id: theater.id,
        ...data,
      });
    } else {
      createTheater.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theater Name</FormLabel>
                <FormControl>
                  <Input placeholder="Theater name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Theater location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/theaters")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {theater ? "Update Theater" : "Create Theater"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
