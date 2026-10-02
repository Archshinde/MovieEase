import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShowViaId } from "../../calls/shows";
import { Row, Col, Card, Button, message, Spin } from "antd";
import moment from "moment";
import "./style.css";
import { bookShow, makePayment } from "../../calls/booking";
import StripeCheckout from "react-stripe-checkout";

function BookShowPage() {
  const params = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const onToken = async (token) => {
    const amount = show.ticketPrice * selectedSeats.length;
    const response = await makePayment({ token, amount, show, selectedSeats });

    if (response.success) {
      message.success("Payment Successful");
      createBooking(response.data);
    } else {
      message.error("Payment Unsuccessful");
    }
  };

  const createBooking = async (transactionId) => {
    const payload = {
      show: show._id,
      seats: [...selectedSeats],
      transactionId: transactionId,
    };
    const response = await bookShow(payload);

    if (response.success) {
      message.success(`Booking Created Successfully`);
      message.success(`Booking details have been sent to your Email ID`);
      setSelectedSeats(() => []);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
      message.error(response.message);
    }
  };

  const getSeats = () => {
    let columns = 20;
    // let totalSeats = 120;
    let totalSeats = show.totalSeats;
    let rows = Math.ceil(totalSeats / columns);
    let allRows = [];

    for (let i = 0; i < rows; i++) {
      allRows.push(i);
    }

    let allColumns = [];
    for (let i = 0; i < columns; i++) {
      allColumns.push(i);
    }

    const handleSeatSelect = (seatNumber) => {
      if (show.bookedSeats.includes(seatNumber)) {
        return;
      }

      if (selectedSeats.includes(seatNumber)) {
        const updatedSelectedSeats = selectedSeats.filter((seat) => {
          return seat !== seatNumber;
        });

        setSelectedSeats(() => updatedSelectedSeats);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    };

    return (
      <div className="seating">
        <div className="screen">
          <hr />
          <hr />
          <hr />
          <p className="pt-2 text-[14px] pb-2">
            Screen this side, you will be watching in this direction
          </p>
        </div>
        <div className="seating-arrangement">
          {allRows.map((row, index) => {
            return (
              <div key={index}>
                {allColumns.map((col) => {
                  let seatNumber = row * columns + col + 1;
                  let seatClass = "seat-btn";

                  // If seat number exceeds totalSeats because of math.ceil
                  if (seatNumber > totalSeats) {
                    return null;
                  }
                  if (show.bookedSeats.includes(seatNumber)) {
                    seatClass += " booked";
                  }

                  if (selectedSeats.includes(seatNumber)) {
                    seatClass += " selected";
                  }
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatSelect(seatNumber)}
                      className={seatClass}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
                <br />
              </div>
            );
          })}
        </div>
        {selectedSeats.length > 0 ? (
          <div className="bg-white shadow-lg p-4 rounded-md w-full max-w-screen-md mx-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Selected Seats</h3>
              <div className="overflow-y-auto h-14 border rounded p-2">
                {selectedSeats.map((seat, index) => (
                  <span
                    key={index}
                    className="inline-block text-center w-[40px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full m-1 text-[13px] font-medium"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center sticky bottom-0 bg-white p-4 border-t">
              <div>
                <h4 className="text-xl font-semibold">Total Price</h4>
                <p className="text-lg text-red-500 font-bold">
                  Rs. {show.ticketPrice * selectedSeats.length}/-
                </p>
              </div>
              {selectedSeats.length > 0 && (
                <div className="stripe-checkout">
                  <StripeCheckout
                    stripeKey={import.meta.env.VITE_STRIPE_KEY}
                    token={onToken}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="titles pt-2">Select seats to proceed</h3>
          </div>
        )}
      </div>
    );
  };

  const getData = async () => {
    setLoading(true);
    const response = await getShowViaId(params.id);

    if (response.success) {
      setShow(() => response.data);
    } else {
      message.error("Unable to fetch show details!");
    }
    setLoading(false);
  };

  return (
    <div className="mt-[65px]">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        show && (
          <div>
            <Row>
              <Col span={24}>
                <Card
                  title={
                    <div>
                      <h1 className="text-3xl font-bold pb-2">
                        {show.movie.title}
                      </h1>
                      <p>
                        Theatre : {show.theatre.name}, {show.theatre.address}
                      </p>
                    </div>
                  }
                  extra={
                    <div className="flex flex-col gap-2 py-4 text-[16px]">
                      <h4>
                        <span className="font-medium text-zinc-400">
                          Show Name :{" "}
                        </span>
                        <span className="font-medium">{show.name}</span>
                      </h4>
                      <h4>
                        <span className="font-medium text-zinc-400">
                          Show time:{" "}
                        </span>
                        <span className="font-medium">
                          {moment(show.date).format("Do MMM YYYY")} {show.time}
                        </span>
                      </h4>
                      <h4>
                        <span className="font-medium text-zinc-400">
                          Ticket Price :{" "}
                        </span>
                        <span className="font-medium">
                          {String(show.ticketPrice + "/-")}
                        </span>
                      </h4>
                      <h4>
                        <span className="font-medium text-zinc-400">
                          Total Seats :{" "}
                        </span>
                        <span className="font-medium">
                          {show.totalSeats} {"|"}{" "}
                        </span>
                        <span className="font-medium text-zinc-400">
                          Available Seats :{" "}
                        </span>{" "}
                        <span className="font-medium">
                          {show.totalSeats - show.bookedSeats.length}
                        </span>
                      </h4>
                    </div>
                  }
                >
                  {getSeats()}
                </Card>
              </Col>
            </Row>
          </div>
        )
      )}
    </div>
  );
}

export default BookShowPage;