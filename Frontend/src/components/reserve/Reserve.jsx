import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import "./reserve.css";
import axios from "axios";
import { baseUrl } from "../../hooks/useFetch";

const Reserve = ({ setOpen, hotelId }) => {
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { dates } = useContext(SearchContext);

  // Ensure dates are available and properly structured
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  // Conditional check for dates before accessing them
  const alldates =
    dates && dates.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber) => {
    // Check if roomNumber and roomNumber.unavailableDates exist
    if (!roomNumber || !roomNumber.unavailableDates) {
      return false; // Treat as unavailable if data is incomplete
    }

    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(baseUrl + `/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="reserve">
        <div className="rContainer">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
          />
          <span>Select your rooms:</span>

          {/* Check if data is loading or there's an error */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error fetching rooms.</p>
          ) : data && data.length > 0 ? (
            data.map((item) =>
              // Ensure item is valid and contains a title
              item && item.title ? (
                <div className="rItem" key={item._id}>
                  <div className="rItemInfo">
                    <div className="rTitle">{item.title}</div>
                    <div className="rDesc">{item.desc}</div>
                    <div className="rMax">
                      Max people: <b>{item.maxPeople}</b>
                    </div>
                    <div className="rPrice">{item.price}</div>
                  </div>
                  <div className="rSelectRooms">
                    {item.roomNumbers.map((roomNumber) => (
                      <div className="room" key={roomNumber._id}>
                        <label>{roomNumber.number}</label>
                        <input
                          type="checkbox"
                          value={roomNumber._id}
                          onChange={handleSelect}
                          disabled={!isAvailable(roomNumber)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null // Handle null or invalid item gracefully
            )
          ) : (
            <p>No rooms available</p>
          )}

          <button
            onClick={handleClick}
            className="rButton"
            disabled={selectedRooms.length === 0}
          >
            Reserve Now!
          </button>
        </div>
      </div>
    </>
  );
};

export default Reserve;
