import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const paymentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.number(),
        status: z.string(),
        paymentMethod: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { userId, amount, status, paymentMethod } = input;
        return await ctx.db.payment.create({
          data: { userId, amount, status, paymentMethod },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create payment",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.payment.findUnique({
          where: { id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find payment",
        });
      }
    }),
  
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { userId } = input;
        return await ctx.db.payment.findMany({
          where: { userId },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch user payments",
        });
      }
    }),
    
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, status } = input;
        return await ctx.db.payment.update({
          where: { id },
          data: { status },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update payment status",
        });
      }
    }),
});
