import MoviePoster from "@/components/MoviePoster";
import ImageWithFallback from "@/components/ImageWithFallback";
import db from "@/db";
import { Movie, SimilarMovie } from "@/types";
import { notFound } from "next/navigation";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

async function MoviePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const movies = db.collection("tessst_movies");

  const search = await movies.find({ $and: [{ _id: id }] });

  if (!(await search.hasNext())) {
    return notFound();
  }

  const movie = (await search.next()) as Movie;

  let similarMovies: SimilarMovie[] = [];
  let hasVectorSearchError = false;

  try {
    const similarMoviesResult = (await movies
      .find(
        {},
        {
          vector: movie.$vector,
          limit: 6, // we will cut the first movie and want to show 5 similar movies
          includeSimilarity: true,
        }
      )
      .toArray()) as SimilarMovie[];

    // cut the first movie because it is the same as the movie we are looking for
    similarMoviesResult.shift();
    similarMovies = similarMoviesResult;
  } catch (error: any) {
    console.error("Vector search failed:", error);
    hasVectorSearchError = true;

    // Fallback: Get movies from the same genre
    try {
      const fallbackMovies = (await movies
        .find(
          {
            Genre: { $regex: movie.Genre.split(",")[0].trim(), $options: "i" },
            _id: { $ne: id },
          },
          {
            limit: 5,
          }
        )
        .toArray()) as SimilarMovie[];

      similarMovies = fallbackMovies;
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      // If even the fallback fails, we'll show an empty array
      similarMovies = [];
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-y-10 p-10 pb-0">
        <div className="shrink-0">
          <ImageWithFallback
            className="w-[300px] h-[450px] object-cover rounded-lg shadow-lg"
            src={movie.Poster}
            alt={movie.Title}
          />
        </div>
        <div className="px-2 md:px-10 flex flex-col gap-y-2">
          <h1 className="text-6xl font-bold">{movie.Title}</h1>
          <p className="text-gray-600">{movie.Genre}</p>
          <p className="font-light">{movie.$vectorize}</p>

          <div className="mt-auto grid grid-cols-2">
            <div className="font-semibold">
              <p>Directed by</p>
              <p>Featuring</p>
              <p>Box Office:</p>
              <p>Released:</p>
              <p>Runtime:</p>
              <p>Rated:</p>
              <p>IMDB Rating:</p>
              <p>Language:</p>
              <p>Country:</p>
            </div>
            <div>
              <p>{movie.Director}</p>
              <p>{movie.Actors}</p>
              <p>{movie.BoxOffice}</p>
              <p>{movie.Released}</p>
              <p>{movie.Runtime}</p>
              <p>{movie.Rated}</p>
              <p>{movie.imdbRating}</p>
              <p>{movie.Language}</p>
              <p>{movie.Country}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <h2 className="text-3xl pt-10 pl-10 font-bold ">
          {hasVectorSearchError
            ? "Movies from the same genre"
            : "Similar Films you may like"}
        </h2>

        {hasVectorSearchError && (
          <div className="pl-10 pr-10 mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
              <p className="font-medium">Note:</p>
              <p>
                AI-powered recommendations are temporarily unavailable. Showing
                movies from the same genre instead.
              </p>
            </div>
          </div>
        )}

        {similarMovies.length > 0 ? (
          <div className="flex justify-between items-center lg:flex-row gap-x-20 gap-y-10 pl-20 pr-10 py-10 overflow-x-scroll">
            {similarMovies.map((movie, i) => (
              <MoviePoster
                key={movie._id}
                index={i + 1}
                similarityRating={
                  movie.$similarity && !hasVectorSearchError
                    ? Number(movie.$similarity.toFixed(2)) * 100
                    : 0
                }
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="pl-10 pr-10 py-10">
            <div className="bg-gray-100 border border-gray-300 text-gray-700 p-8 rounded text-center">
              <p className="text-lg font-medium">No similar movies found</p>
              <p>
                Try browsing our movie collection or search for specific titles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoviePage;
