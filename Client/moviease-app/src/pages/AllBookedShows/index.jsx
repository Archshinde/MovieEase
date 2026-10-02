import React, { useEffect, useState } from "react";
import { getAllBookedShows } from "../../calls/shows";
import { message, Card, Input, Select, Spin } from "antd";
import moment from "moment";

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

function BookedShows({ userDetails }) {
  const [bookedShows, setBookedShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("showNameAsc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllBookings();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFiltersAndSorting = () => {
      let shows = bookedShows;

      if (searchTerm) {
        shows = shows.filter((booking) =>
          booking.show.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      switch (sortOption) {
        case "showNameAsc":
          shows = shows.sort((a, b) => a.show.name.localeCompare(b.show.name));
          break;
        case "showNameDesc":
          shows = shows.sort((a, b) => b.show.name.localeCompare(a.show.name));
          break;
        case "dateAsc":
          shows = shows.sort(
            (a, b) => new Date(a.show.date) - new Date(b.show.date)
          );
          break;
        case "dateDesc":
          shows = shows.sort(
            (a, b) => new Date(b.show.date) - new Date(a.show.date)
          );
          break;
        case "priceDesc":
          shows = shows.sort(
            (a, b) =>
              a.show.ticketPrice * a.seats.length -
              b.show.ticketPrice * b.seats.length
          );
          break;
        case "priceAsc":
          shows = shows.sort(
            (a, b) =>
              b.show.ticketPrice * b.seats.length -
              a.show.ticketPrice * a.seats.length
          );
          break;
        default:
          break;
      }

      setFilteredShows(shows);
    };

    applyFiltersAndSorting();
  }, [searchTerm, bookedShows, sortOption]);

  const fetchAllBookings = async () => {
    setLoading(true);
    const response = await getAllBookedShows({ userDetails });
    if (response.success) {
      setBookedShows(response.data);
    } else {
      message.error(response.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-32 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booked Shows</h1>
      <div className="flex items-center justify-between mb-6">
        <Search
          placeholder="Search by show name"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          enterButton
          className="w-full md:w-1/2 lg:w-1/3"
        />
        <Select
          defaultValue="showNameAsc"
          onChange={(value) => setSortOption(value)}
          className="w-full md:w-1/4 lg:w-1/5 ml-4"
          style={{ width: 200 }}
        >
          <Option value="showNameAsc">Name (A-Z)</Option>
          <Option value="showNameDesc">Name (Z-A)</Option>
          <Option value="dateAsc">Date (Old to New)</Option>
          <Option value="dateDesc">Date (New to Old)</Option>
          <Option value="priceAsc">Price (Low to High)</Option>
          <Option value="priceDesc">Price (High to Low)</Option>
        </Select>
      </div>
      {loading ? (
        <div className="flex justify-center h-screen">
          <Spin size="large" />
        </div>
      ) : bookedShows.length === 0 ? (
        <div className="flex justify-center items-top h-screen text-2xl font-bold text-blue-600 bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
          You haven't booked any shows :(
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredShows.map((booking) => (
            <Card
              key={booking._id}
              className="w-full"
              cover={
                <img
                  alt={booking.show.movie.title}
                  src={booking.show.movie.poster} // Ensure this field is correct
                  className="h-48 w-full object-cover rounded-t-lg"
                />
              }
            >
              <Meta
                title={booking.show.name}
                description={
                  <div className="text-sm">
                    <p className="mb-1">
                      <strong>Theatre:</strong> {booking.show.theatre.name}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong>{" "}
                      {moment(booking.show.date).format("YYYY-MM-DD")}
                    </p>
                    <p className="mb-1">
                      <strong>Time:</strong> {booking.show.time}
                    </p>
                    <p className="mb-1">
                      <strong>Seats:</strong> {booking.seats.join(", ")}
                    </p>
                    <p className="mb-1">
                      <strong>Price:</strong> Rs.{" "}
                      {booking.show.ticketPrice * booking.seats.length} /-
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookedShows;