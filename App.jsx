import React, { useState, useEffect } from "react";
import "./App.css";
import { FiMoon, FiSun } from "react-icons/fi";

const App = () => {
  const totalSeats = 50;
  const totalTables = 60;

  const [seatsLeft, setSeatsLeft] = useState(totalSeats);
 
  const [reservations, setReservations] = useState([]);
  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load theme preference from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleAddReservation = (e) => {
    e.preventDefault();
    const guests = parseInt(guestCount);

    if (!name || !phone || !guestCount) {
      alert("Please fill in all fields.");
      return;
    }

    if (guests > seatsLeft) {
      alert("Not enough seats available.");
      return;
    }

    const newReservation = {
      id: Date.now(),
      name,
      phone,
      guestCount: guests,
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
    };

    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guests);
    

    setName("");
    setPhone("");
    setGuestCount("");
  };

  const handleCheckout = (id) => {
    const reservation = reservations.find((res) => res.id === id);
    if (!reservation || reservation.checkOut) return;

    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === id ? { ...res, checkOut: new Date().toLocaleTimeString() } : res
      )
    );

    setSeatsLeft(seatsLeft + reservation.guestCount);
   
  };

  const handleDeleteReservation = (id) => {
    setReservations((prevReservations) => prevReservations.filter((res) => res.id !== id));
  };

  return (
    <div className={`app-container`}>
      <header className="header">
        <h1>🍽️ Restaurant Reservation</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </header>

      {/* Table & Seat Availability */}
      <div className="dashboard">
        <div className="info-box total">
          <h3>Total Seats</h3>
          <p>{totalSeats}</p>
        </div>
        <div className="info-box available">
          <h3>Seats Left</h3>
          <p>{seatsLeft}</p>
        </div>
      </div>

      {/* Reservation Form */}
      <form onSubmit={handleAddReservation} className="reservation-form">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
        <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder="Guest Count" min="1" required />
        <button type="submit" className="confirm-btn">Add Reservation</button>
      </form>

      {/* Reservations List */}
      <div className="reservation-list">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <h3>{res.name}</h3>
              <p>📞 {res.phone}</p>
              <p>🧍 {res.guestCount} Guests</p>
              <p>⏳ Check-In: {res.checkIn}</p>
              <p>✅ Check-Out: {res.checkOut || "Not Checked Out"}</p>
              {!res.checkOut ? (
                <button className="checkout-btn" onClick={() => handleCheckout(res.id)}>
                  Checkout
                </button>
              ) : (
                <button className="delete-btn" onClick={() => handleDeleteReservation(res.id)}>
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-reservations">No Reservations Yet</p>
        )}
      </div>
    </div>
  );
};

export default App;
