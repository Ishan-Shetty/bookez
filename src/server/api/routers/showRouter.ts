import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { startOfDay, endOfDay } from "date-fns";
import type { Prisma } from "@prisma/client";

export const showRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        movieId: z.string(),
        theaterId: z.string(),
        screenId: z.string(),
        startTime: z.date(),
        price: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { movieId, theaterId, screenId, startTime, price } = input;
        return await ctx.db.show.create({
          data: { 
            movieId, 
            theaterId, 
            screenId, 
            startTime,
            ...(price !== undefined ? { price } : {}),
          },
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
          },
          orderBy: {
            startTime: 'asc'
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch shows",
        });
      }
    }),
    
  getFiltered: publicProcedure
    .input(
      z.object({
        movieId: z.string().optional(),
        theaterId: z.string().optional(),
        date: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { movieId, theaterId, date } = input;
        
        const where: Prisma.ShowWhereInput = {};
        
        if (movieId) {
          where.movieId = movieId;
        }
        
        if (theaterId) {
          where.theaterId = theaterId;
        }
        
        if (date) {
          where.startTime = {
            gte: startOfDay(date),
            lte: endOfDay(date),
          };
        } else {
          // Default to future shows
          where.startTime = {
            gte: new Date(),
          };
        }
        
        return await ctx.db.show.findMany({
          where,
          include: {
            movie: true,
            theater: true,
            screen: true,
          },
          orderBy: {
            startTime: 'asc'
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch filtered shows",
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        movieId: z.string().optional(),
        theaterId: z.string().optional(),
        screenId: z.string().optional(),
        startTime: z.date().optional(),
        price: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        return await ctx.db.show.update({
          where: { id },
          data,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update show",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.db.show.delete({
          where: { id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to delete show",
        });
      }
    }),
});
