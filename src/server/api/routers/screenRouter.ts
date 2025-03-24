import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const screenRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        theaterId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { theaterId, name } = input;
        return await ctx.db.screen.create({
          data: { theaterId, name },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create screen",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.screen.findUnique({
          where: { id },
          include: {
            seats: true,
            theater: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find screen",
        });
      }
    }),
  
  getByTheaterId: publicProcedure
    .input(z.object({ theaterId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { theaterId } = input;
        return await ctx.db.screen.findMany({
          where: { theaterId },
          include: {
            seats: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch theater screens",
        });
      }
    }),
});
