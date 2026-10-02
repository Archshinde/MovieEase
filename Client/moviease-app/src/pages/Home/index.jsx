import React, { useEffect, useState } from "react";
import { message } from "antd";
import { getAllMovies } from "../../calls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SearchBar from "../../components/SearchBar";

function Home() {
  const [movies, setMovies] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  const getData = async () => {
    const response = await getAllMovies();
    if (response.success) {
      setMovies(response.data);
    } else {
      message.error(response.message);
    }
    setLoading(false); // Stop loading after data is fetched
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (movies) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  return (
    <>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* <div className="my-[60px] h-[100rem] px-4 pb-20 sm:px-6 md:px-8"> */}
      <div className="my-[60px] px-4 pb-20 sm:px-6 md:px-8">
        {/* <div className="flex flex-wrap gap-8 justify-center mt-8"> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-8">
          {loading ? (
            // Loader: Display placeholders while loading
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex-col w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] animate-pulse"
                >
                  <div className="h-[210px] sm:h-[240px] md:h-[270px] lg:h-[300px] w-full bg-gray-300 rounded-2xl" />
                  <div className="h-[40px] mt-2 bg-gray-300 rounded-3xl" />
                </div>
              ))
          ) : filteredMovies && filteredMovies.length !== 0 ? (
            filteredMovies.map((movie) => {
              return (
                <div
                  key={movie._id}
                  className="flex-col w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                >
                  <img
                    className="h-[210px] sm:h-[240px] md:h-[270px] lg:h-[300px] w-full transition-transform cursor-pointer rounded-2xl hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                      navigate(
                        `/movie/${movie._id}?date=${moment().format(
                          "YYYY-MM-DD"
                        )}`
                      );
                    }}
                    src={movie.poster}
                    alt="movie poster"
                  />
                  <h1
                    // className="cursor-pointer move-up duration-200 transition-transform flex justify-center items-center mt-2 h-[40px] bg-stone-100 backdrop-blur bg-blur rounded-3xl font-bold text-[17px] text-blue-900"
                    className="cursor-pointer move-up duration-200 transition-transform flex justify-center items-center text-center mt-2 h-[52px] px-2 bg-stone-100 backdrop-blur bg-blur rounded-3xl font-bold text-[16px] leading-5 text-blue-900"
                    onClick={() => {
                      navigate(
                        `/movie/${movie._id}?date=${moment().format(
                          "YYYY-MM-DD"
                        )}`
                      );
                    }}
                  >
                    {movie.title}
                  </h1>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center items-top h-screen text-xl font-bold text-gray-400 rounded-lg p-6">
              <div> Oops! No movies match your search.</div>
              <div>
                {" "}
                Maybe try a popcorn-worthy blockbuster or check your spelling?
                🍿
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
