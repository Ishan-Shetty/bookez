import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const movieRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        duration: z.coerce.number().int().positive("Duration must be a positive number"),
        description: z.string().optional().nullable(),
        posterUrl: z.string().url("Must be a valid URL").optional().nullable(),
        releaseDate: z.date().optional().nullable(),
        id: z.string().optional(),
        _action: z.string().optional(),
        movieId: z.string().optional(), // Add support for movieId parameter used by client
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { _action, id, movieId, ...data } = input;
        
        // Handle delete action - use either id or movieId (client sends movieId)
        if (_action === "delete") {
          const deleteId = id ?? movieId;
          if (!deleteId) {
            throw new Error("Movie ID is required for deletion");
          }
          
          return await ctx.db.movie.delete({
            where: { id: deleteId },
          });
        }
        
        // Handle update action
        if (_action === "update" && id) {
          return await ctx.db.movie.update({
            where: { id },
            data: {
              ...data,
              // Ensure these fields are properly formatted for database
              posterUrl: data.posterUrl ?? null,
              releaseDate: data.releaseDate ?? null,
            },
          });
        }
        
        // Handle create action
        return await ctx.db.movie.create({
          data: {
            ...data,
            // Ensure these fields are properly formatted for database
            posterUrl: data.posterUrl ?? null,
            releaseDate: data.releaseDate ?? null,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process movie operation",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.movie.findUnique({
          where: { id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find movie",
        });
      }
    }),
  
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.movie.findMany();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch movies",
        });
      }
    }),
});
