import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const seatRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        screenId: z.string(),
        number: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { screenId, number } = input;
        return await ctx.db.seat.create({
          data: { screenId, number },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create seat",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.seat.findUnique({
          where: { id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find seat",
        });
      }
    }),
  
  getByScreenId: publicProcedure
    .input(z.object({ screenId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { screenId } = input;
        return await ctx.db.seat.findMany({
          where: { screenId },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch screen seats",
        });
      }
    }),
    
  updateBookingStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      isBooked: z.boolean()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, isBooked } = input;
        return await ctx.db.seat.update({
          where: { id },
          data: { isBooked },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update seat booking status",
        });
      }
    }),
});
