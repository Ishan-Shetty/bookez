/**
 * Type definitions for the BookEZ application
 */

export interface MovieWithDetails {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  duration?: number;
  rating?: number;
  releaseDate?: string | Date;
  language?: string;
  genres?: string[];
  director?: string;
  cast?: string[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface Screen {
  id: string;
  name: string;
  theaterId: string;
}

export interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  startTime: Date;
  endTime?: Date;
  price: number;
  theater: Theater;
  screen: Screen;
}
