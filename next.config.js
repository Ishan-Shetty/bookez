/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // For backward compatibility, also keep domains
    domains: [
      'upload.wikimedia.org',
      'image.tmdb.org',
      'm.media-amazon.com',
      'images.unsplash.com',
      'static.wikia.nocookie.net',
      'www.themoviedb.org',
      'media.licdn.com',
      'assets.nflxext.com',
      'i.imgur.com',
      'img.youtube.com',
      'images-na.ssl-images-amazon.com',
      'picsum.photos',
      'via.placeholder.com',
      'localhost'
    ]
  }
};

export default config;
