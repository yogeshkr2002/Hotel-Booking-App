import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch.js";

const List = () => {
  const location = useLocation();

  // Add default values to handle cases where location.state might be undefined
  const [destination, setDestination] = useState(
    location.state?.destination || ""
  );
  const [dates, setDates] = useState(
    location.state?.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(
    location.state?.options || { adult: 1, children: 0, room: 1 }
  );
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(9999);

  // Update fetch request URL using state variables
  // const { data, loading, error, reFetch } = useFetch(
  //   `/hotels?city=${destination}&min=${min}&max=${max}`
  // );

  const { data, loading, error, reFetch } = useFetch(`/hotels`);

  const handleClick = () => {
    reFetch();
  };

  return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            {/* Destination input with onChange handler */}
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter your destination"
              />
            </div>

            {/* Date Range Picker */}
            <div className="lsItem">
              <label>Check-in-date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(
                  dates[0].endDate,
                  "dd/MM/yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            {/* Search Options */}
            <div className="lsItem">
              <label htmlFor="">Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min Price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max Price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adult}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, adult: e.target.value }))
                    }
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        children: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.room}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, room: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button onClick={handleClick} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Search Results */}
          <div className="listResult">
            {loading ? (
              "loading..."
            ) : (
              <>
                {data?.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
            {error && (
              <div>Failed to load results. Please try again later.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
