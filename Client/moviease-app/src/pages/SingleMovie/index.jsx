import { message, Input, Row, Col, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getMovie } from "../../calls/movies";
import moment from "moment";
import { getAllTheatesByMovie } from "../../calls/shows";

function SingleMovie() {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(
  searchParams.get("date") || moment().format("YYYY-MM-DD")
);
  const [theatres, setTheatres] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    getMovieDeatils();
  }, []);

  const handleDate = (e) => {
    setDate(e.target.value);
    navigate(
      `/movie/${movie._id}?date=${moment(e.target.value).format("YYYY-MM-DD")}`
    );
  };

  const getMovieDeatils = async () => {
    setLoading(true);
    const response = await getMovie(params.id);

    if (response.success) {
      setMovie(() => ({ ...response.data }));
    } else {
      message.error(response.message);
    }
    setLoading(false);
  };

  const getAllTheatres = async () => {
    setLoading(true);
    const response = await getAllTheatesByMovie(params.id, date);
    if (response.success) {
      setTheatres(() => response.data);
    } else {
      message.error(response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllTheatres();
  }, [date]);

  return (
    <div className="relative p-4 md:p-8 mt-10">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {movie && (
            <>
              <div
                className="absolute inset-0 h-[100vh]"
                style={{
                  backgroundImage: `url(${movie.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.05, // Very low opacity
                }}
              ></div>
              <div className="flex flex-col md:flex-row items-center md:items-start md:gap-8 mt-10">
                <div>
                  <img
                    className="rounded-lg"
                    src={movie.poster}
                    width={150} // Smaller poster size
                    alt="Movie Poster"
                  />
                </div>
                <div className="flex flex-col gap-4 mt-4 md:mt-0">
                  <h1 className="text-3xl font-bold text-blue-950">{movie.title}</h1>
                  <hr />
                  <div>
                    <p className="movie-data">
                      Language: <span>{movie.language}</span>
                    </p>
                    <p className="movie-data">
                      Genre: <span>{movie.genre}</span>
                    </p>
                    <p className="movie-data">
                      Release Date:{" "}
                      <span>{moment(movie.releaseDate).format("MMM Do YYYY")}</span>
                    </p>
                    <p className="movie-data">
                      Duration: <span>{movie.duration}</span>
                    </p>
                  </div>
                  <hr />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-10">
                <label className="text-xl font-semibold">Choose the date:</label>
                <Input
                  type="date"
                  value={date}
                  onChange={handleDate}
                />
              </div>
            </>
          )}

          <h2 className="mt-8 text-2xl font-bold">Theatres</h2>
          {theatres && theatres.length === 0 && (
            <div className="mt-4">
              <h2 className="text-blue-700 text-xl font-semibold">
                Currently, no theatres available for this movie :(
              </h2>
            </div>
          )}

          {theatres && theatres.length > 0 && (
            <div className="mt-4">
              {theatres.map((show) => (
                <div key={show._id} className="py-4 border-b">
                  <Row className="flex flex-wrap justify-between">
                    <Col lg={7}>
                      <h3 className="text-lg font-medium">{show.theatre.name}</h3>
                      <p className="text-blue-500">{show.theatre.address}</p>
                    </Col>
                    <Col>
                      <Button className="bg-indigo-700 text-white font-bold" onClick={() => navigate(`/book-show/${show._id}`)}>
                        <h5>{show.time}</h5>
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SingleMovie;