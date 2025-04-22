import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, email } = input;
        return await ctx.db.user.create({
          data: { name, email, role: "USER" },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create user",
        });
      }
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, email, password } = input;
        
        // Check if user exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email },
        });
        
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email already exists",
          });
        }
        
        // Hash password
        const hashedPassword = await hash(password, 12);
        
        // Create user
        const user = await ctx.db.user.create({
          data: { 
            name, 
            email, 
            hashedPassword,
            role: "USER",
          },
        });
        
        // Return only necessary user data (avoid returning sensitive information)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        // Properly handle TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // For any other errors, create a proper TRPC error
        console.error("Registration error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to register user",
          // Don't include cause with potential sensitive data in production
          cause: process.env.NODE_ENV === "development" ? error : undefined,
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        
        // For security, only allow users to get their own info unless they're an admin
        if (ctx.session.user.id !== id && ctx.session.user.role !== "ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to access this user",
          });
        }
        
        const user = await ctx.db.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
          }
        });
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        
        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to find user",
        });
      }
    }),
  
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Only admins can get all users
        if (ctx.session.user.role !== "ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can access all users",
          });
        }
        
        return await ctx.db.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
          }
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch users",
        });
      }
    }),

  getMyBookings: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.booking.findMany({
          where: {
            userId: ctx.session.user.id
          },
          include: {
            show: {
              include: {
                movie: true,
                theater: true,
                screen: true,
              }
            },
            seat: true,
            payment: true,
          },
          orderBy: {
            bookingTime: 'desc'
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch bookings",
        });
      }
    }),
});
