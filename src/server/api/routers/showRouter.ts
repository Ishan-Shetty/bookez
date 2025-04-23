import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { startOfDay, endOfDay, addHours } from "date-fns";
import type { Prisma } from "@prisma/client";

export const showRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        movieId: z.string().nonempty(),
        theaterId: z.string().nonempty(),
        screenId: z.string().nonempty(),
        startTime: z.date(),
        price: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { movieId, theaterId, screenId, startTime, price } = input;
        
        // Calculate approximate endTime for conflict checking (2 hours after start)
        const approximateEndTime = addHours(startTime, 2);
        
        // Check for time conflicts
        const conflictingShows = await ctx.db.show.findMany({
          where: {
            screenId,
            OR: [
              {
                // Show starts during another show's estimated time
                startTime: {
                  gte: startTime,
                  lt: approximateEndTime,
                },
              },
              {
                // Another show starts during this show's estimated time
                startTime: {
                  gte: startTime,
                  lt: approximateEndTime,
                },
              },
            ],
          },
        });

        if (conflictingShows.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "There's already a show scheduled at this time for the selected screen",
          });
        }
        
        return await ctx.db.show.create({
          data: { movieId, theaterId, screenId, startTime, price },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create show",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().nonempty() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const show = await ctx.db.show.findUnique({
          where: { id },
          include: {
            movie: true,
            theater: true,
            screen: true,
          }
        });

        if (!show) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Show not found",
          });
        }

        return show;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
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
            startTime: 'desc' // Changed from showTime to startTime
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch all shows",
        });
      }
    }),
    
  getAllForAdmin: adminProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.show.findMany({
          include: {
            movie: true,
            theater: true,
            screen: true,
            bookings: true,
          },
          orderBy: {
            startTime: 'desc' // Changed from showTime to startTime
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch shows for admin",
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
        
        // Check for conflicts if updating times or screen
        if ((data.startTime || data.screenId)) {
          const currentShow = await ctx.db.show.findUnique({
            where: { id },
            select: { startTime: true, screenId: true },
          });
          
          if (!currentShow) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Show not found",
            });
          }
          
          const checkStartTime = data.startTime ?? currentShow.startTime;
          const checkScreenId = data.screenId ?? currentShow.screenId;
          const approximateEndTime = addHours(checkStartTime, 2);
          
          const conflictingShows = await ctx.db.show.findMany({
            where: {
              id: { not: id }, // Exclude current show
              screenId: checkScreenId,
              OR: [
                {
                  // Another show starts during this show's time
                  startTime: {
                    gte: checkStartTime,
                    lt: approximateEndTime,
                  },
                },
                {
                  // This show starts during another show's time
                  startTime: {
                    lt: checkStartTime,
                    gt: addHours(checkStartTime, -2), // Assuming ~2 hours per show
                  },
                },
              ],
            },
          });
          
          if (conflictingShows.length > 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "There's already a show scheduled at this time for the selected screen",
            });
          }
        }
        
        return await ctx.db.show.update({
          where: { id },
          data,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
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
