import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        showId: z.string(),
        seatId: z.string(),
        paymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { userId, showId, seatId, paymentId } = input;
        return await ctx.db.booking.create({
          data: { userId, showId, seatId, paymentId },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create booking",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.booking.findUnique({
          where: { id },
          include: {
            user: true,
            show: true,
            seat: true,
            payment: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find booking",
        });
      }
    }),
  
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { userId } = input;
        return await ctx.db.booking.findMany({
          where: { userId },
          include: {
            show: {
              include: {
                movie: true,
                theater: true,
              }
            },
            seat: true,
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch user bookings",
        });
      }
    }),
});
