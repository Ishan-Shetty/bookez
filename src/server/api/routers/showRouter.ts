import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const showRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        movieId: z.string(),
        theaterId: z.string(),
        screenId: z.string(),
        startTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { movieId, theaterId, screenId, startTime } = input;
        return await ctx.db.show.create({
          data: { movieId, theaterId, screenId, startTime },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create show",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.show.findUnique({
          where: { id },
          include: {
            movie: true,
            theater: true,
            screen: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find show",
        });
      }
    }),
  
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.show.findMany({
          include: {
            movie: true,
            theater: true,
            screen: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch shows",
        });
      }
    }),
});
