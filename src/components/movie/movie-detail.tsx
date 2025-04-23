"use client";

import Image from "next/image";
import { Calendar, Clock, Star, Tag, ChevronRight, Film } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { ShowTimesList } from "~/components/show/show-times-list";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

interface MovieDetailProps {
  movie: {
    id: string;
    title: string;
    posterUrl?: string | null;
    duration: number;
    description?: string | null;
    releaseDate?: Date | null;
    genre?: string | null;
    director?: string | null;
    cast?: string | null;
    rating?: number | null;
  };
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const { id, title, posterUrl, duration, description, releaseDate, genre, director, cast, rating } = movie;
  const [selectedTab, setSelectedTab] = useState<"overview" | "showtimes">("overview");
  
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;
  const formattedDuration = 
    `${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}min`;

  return (
    <div className="relative">
      {/* Hero section with backdrop/poster */}
      <div className="relative mb-8 h-[50vh] min-h-[300px] w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        {posterUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="container relative flex h-full items-end pb-8">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            {/* Movie Poster */}
            <div className="hidden overflow-hidden rounded-lg border shadow-lg md:block md:h-[350px] md:w-[233px]">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  width={233}
                  height={350}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Film className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Movie Title and Basic Info */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{title}</h1>
              
              <div className="flex flex-wrap gap-3">
                {releaseDate && (
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(releaseDate)}
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                  <Clock className="mr-1 h-3 w-3" />
                  {formattedDuration}
                </Badge>
                
                {genre && (
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                    <Tag className="mr-1 h-3 w-3" />
                    {genre}
                  </Badge>
                )}
                
                {rating && (
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                    <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {rating.toFixed(1)}/10
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Poster */}
      <div className="container -mt-24 mb-6 block md:hidden">
        <div className="mx-auto h-[250px] w-[167px] overflow-hidden rounded-lg border shadow-lg">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              width={167}
              height={250}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      
      <div className="container">
        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-4 border-b">
          <Button 
            variant="ghost" 
            className={`pb-2 ${selectedTab === 'overview' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant="ghost" 
            className={`pb-2 ${selectedTab === 'showtimes' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setSelectedTab('showtimes')}
          >
            Showtimes
          </Button>
        </div>
        
        {/* Content based on selected tab */}
        {selectedTab === 'overview' && (
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Synopsis</h2>
                <p className="text-muted-foreground">{description ?? "No description available."}</p>
              </div>

              {cast && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Cast</h2>
                  <p className="text-muted-foreground">{cast}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6 rounded-lg border p-6">
              <div>
                <h3 className="mb-2 font-medium">Director</h3>
                <p className="text-muted-foreground">{director ?? "Not specified"}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-2 font-medium">Genre</h3>
                <p className="text-muted-foreground">{genre ?? "Not specified"}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-2 font-medium">Release Date</h3>
                <p className="text-muted-foreground">
                  {releaseDate ? formatDate(releaseDate) : "Not specified"}
                </p>
              </div>
              
              <Separator />
              
              <Button 
                className="mt-4 w-full" 
                onClick={() => setSelectedTab('showtimes')}
              >
                View Showtimes <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {selectedTab === 'showtimes' && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Available Showtimes</h2>
            <ShowTimesList movieId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
