import { Movie, SimilarMovie } from "@/types";
import Link from "next/link";
import ImageWithFallback from "./ImageWithFallback";

function MoviePoster({
  index,
  similarityRating,
  movie,
}: {
  index?: number;
  similarityRating?: number;
  movie: Movie | SimilarMovie;
}) {
  return (
    <Link key={movie._id} href={`/movie/${movie._id}`} className="group">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        
        <div className="relative">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-2xl">
            <ImageWithFallback
              className="w-full h-96 object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-500"
              src={movie.Poster}
              alt={movie.Title}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>

          {/* Similarity Rating Badge */}
          {similarityRating && (
            <div className="absolute bottom-4 right-4 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-full font-bold text-white text-lg shadow-lg border-2 border-white/20 backdrop-blur-sm">
              {similarityRating}%
            </div>
          )}

          {/* Index Number */}
          {index && (
            <div className="absolute text-white/10 top-24 -left-8 text-9xl font-black">
              {index}
            </div>
          )}
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-4 space-y-1">
        <p className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
          {movie.Title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{movie.Genre}</p>
      </div>
    </Link>
  );
}

export default MoviePoster;
