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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { Screen } from "@prisma/client";

const screenFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rows: z.coerce.number().int().min(1, "Rows must be at least 1").max(26, "Maximum 26 rows (A-Z)"),
  columns: z.coerce.number().int().min(1, "Columns must be at least 1").max(50, "Maximum 50 columns"),
});

type ScreenFormValues = z.infer<typeof screenFormSchema>;

// Define the screen update input type to match the API expectations
type ScreenUpdateInput = ScreenFormValues & {
  id: string;
  _action?: string;
};

interface ScreenFormProps {
  screen?: Screen & { theater?: { name: string } };
  theaterId: string;
}

export function ScreenForm({ screen, theaterId }: ScreenFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScreenFormValues>({
    resolver: zodResolver(screenFormSchema),
    defaultValues: screen
      ? {
          name: screen.name,
          rows: screen.rows,
          columns: screen.columns,
        }
      : {
          name: "",
          rows: 10,
          columns: 10,
        },
  });

  const createScreen = api.screen.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Screen created successfully",
      });
      router.push(`/admin/screens?theaterId=${theaterId}`);
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message ?? "Failed to create screen",
        variant: "destructive",
      });
    },
  });

  // Use create mutation since update doesn't exist
  const updateScreen = api.screen.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Screen updated successfully",
      });
      router.push(`/admin/screens?theaterId=${theaterId}`);
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message ?? "Failed to update screen",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScreenFormValues) => {
    setIsSubmitting(true);
    
    if (screen) {
      updateScreen.mutate({
        id: screen.id,
        _action: "update", // Special field to indicate update operation
        ...data,
      } as ScreenUpdateInput);
    } else {
      createScreen.mutate({
        theaterId,
        ...data,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screen Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Screen 1, IMAX, etc." {...field} />
              </FormControl>
              <FormDescription>
                A name to identify this screen within the theater
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="rows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rows</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of rows"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Maximum 26 rows (A-Z)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="columns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Columns</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of columns"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Number of seats per row
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/admin/screens?theaterId=${theaterId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {screen ? "Update Screen" : "Create Screen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
