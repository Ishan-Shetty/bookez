import { createCallerFactory, createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { movieRouter } from "./routers/movieRouter";
import { theaterRouter } from "./routers/theaterRouter";
import { showRouter } from "./routers/showRouter";
import { bookingRouter } from "./routers/bookingRouter";
import { screenRouter } from "./routers/screenRouter";
import { seatRouter } from "./routers/seatRouter";
import { paymentRouter } from "./routers/paymentRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  movie: movieRouter,
  theater: theaterRouter,
  show: showRouter,
  booking: bookingRouter,
  screen: screenRouter,
  seat: seatRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
