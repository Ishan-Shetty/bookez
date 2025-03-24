import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const theaterRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, location } = input;
        return await ctx.db.theater.create({
          data: { name, location },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create theater",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.theater.findUnique({
          where: { id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find theater",
        });
      }
    }),
  
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.theater.findMany();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch theaters",
        });
      }
    }),
});
